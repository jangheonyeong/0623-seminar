const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const resetButton = document.getElementById('reset-button'); // 추가된 리셋 버튼

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let messages = [
  {
    role: 'system',
    content: '너는 친절하고 이해하기 쉬운 설명을 제공하는 한국어 수학 튜터야. 반드시 한국어로 대답해줘.',
  },
];

function appendMessage(sender, text, type = "normal") {
  const msg = document.createElement('div');
  msg.classList.add('message');
  msg.classList.add(sender === "사용자" ? "user" : "bot");

  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  if (type === "loading") msg.classList.add("loading");
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return msg; // 로딩 메시지를 추후 삭제 가능하게 반환
}

async function handleSend() {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage('사용자', input);
  userInput.value = '';
  userInput.disabled = true;
  sendButton.disabled = true;

  messages.push({ role: 'user', content: input });

  const loadingMsg = appendMessage('챗봇', '생각 중입니다...', 'loading');

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! 상태 코드: ${response.status}`);

    const data = await response.json();
    const reply = data.choices[0].message.content;

    loadingMsg.remove(); // 로딩 메시지 제거
    appendMessage("챗봇", reply);
    messages.push({ role: 'assistant', content: reply });
  } catch (err) {
    console.error(err);
    loadingMsg.remove();
    appendMessage("챗봇", "오류가 발생했습니다. 다시 시도해 주세요.");
  } finally {
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
  }
}

// 버튼 클릭 시 전송
sendButton.addEventListener('click', handleSend);

// 엔터 키 / Shift+Enter 처리
userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (event.shiftKey) return; // 줄바꿈 허용
    event.preventDefault();
    handleSend();
  }
});

// 대화 초기화 버튼
resetButton.addEventListener('click', () => {
  messages = [
    {
      role: 'system',
      content: '너는 친절하고 이해하기 쉬운 설명을 제공하는 한국어 수학 튜터야. 반드시 한국어로 대답해줘.',
    },
  ];
  chatWindow.innerHTML = '';
  appendMessage("챗봇", "안녕하세요! 무엇이든 물어보세요.");
});
