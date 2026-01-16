package home.fileserver.configs.filters;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Add this simple filter to enforce a hard time limit
public class AbsoluteSessionTimeoutFilter extends OncePerRequestFilter {
    // 8 Hours Max Absolute Lifetime
    private static final long MAX_SESSION_HOURS = 8;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);

        if (session != null) {
            long creationTime = session.getCreationTime();
            long now = System.currentTimeMillis();
            long duration = now - creationTime;

            if (duration > (MAX_SESSION_HOURS * 60 * 60 * 1000)) {
                // 1. Kill the session immediately
                session.invalidate();

                // 2. Check if this is an API/AJAX request
                String acceptHeader = request.getHeader("Accept");
                String xRequestedWith = request.getHeader("X-Requested-With");

                String secFetchMode = request.getHeader("Sec-Fetch-Mode"); // <--- ADD THIS

                boolean isApiRequest = 
                    (xRequestedWith != null && xRequestedWith.equals("XMLHttpRequest")) 
                    || ("cors".equals(secFetchMode))
                    || (acceptHeader != null && (acceptHeader.contains("application/json") 
                    || acceptHeader.equals("*/*")));

                if (isApiRequest) {
                    // API: Send JSON 401
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Session absolute timeout exceeded\"}");
                } else {
                    // Browser: Redirect to login
                    response.sendRedirect("/login?expired=true");
                }
                
                // 3. CRITICAL: Stop the chain here. Do not proceed.
                return; 
            }
        }
        
        filterChain.doFilter(request, response);
    }
}