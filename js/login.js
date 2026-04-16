document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        window.location.href = btn.dataset.destino;
    });
});