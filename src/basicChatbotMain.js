const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// 환경변수에서 API Key 불러오기
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  msg.style.marginBottom = '10px';
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendButton.addEventListener('click', async () => {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage('사용자', input);
  userInput.value = '';

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! 상태 코드: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    appendMessage("챗봇", reply);
  } catch (err) {
    console.error(err);
    appendMessage("챗봇", "오류가 발생했습니다. API 키 또는 네트워크를 확인해주세요.");
  }
});
