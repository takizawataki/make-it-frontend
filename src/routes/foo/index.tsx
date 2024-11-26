import { createFileRoute } from '@tanstack/react-router';
import { useSpeechRecognition } from 'react-speech-recognition';

export const Route = createFileRoute('/foo/')({
  component: Foo,
});

function Foo() {
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();
  const SpeechRecognition = webkitSpeechRecognition || window.SpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'ja-JP';

  recognition.onresult = (event) => {
    alert(event.results[0][0].transcript);
  };

  recognition.start();

  return (
    <>
      <div>{browserSupportsSpeechRecognition ? 'true' : 'false'}</div>
      <button onClick={() => console.log(browserSupportsSpeechRecognition)}>
        test
      </button>
    </>
  );
}
