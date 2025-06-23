import Swal from 'sweetalert2';

const button = document.getElementById("warning-button");

button.addEventListener("click", () => {
  Swal.fire({
    icon: 'warning',
    title: '경고',
    text: '클릭하지 마세요!',
    confirmButtonText: '알겠습니다',
    confirmButtonColor: '#66bb6a', // 파스텔 초록
    background: '#e8f5e9',
    color: '#2e7d32'
  });
});
