document.addEventListener('DOMContentLoaded', function() {
    console.log("Javascript is loaded!");
    
    const btn = document.getElementById('alertBtn');
    if(btn){
        btn.addEventListener('click', function() {
            alert('Spring Boot is serving this JS file correctly!');
        });
    }
});