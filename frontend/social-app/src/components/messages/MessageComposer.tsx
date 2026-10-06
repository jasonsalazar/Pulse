import {
  type SubmitEvent,
  useState,
  type KeyboardEvent,
  useRef,
  useEffect,
} from "react";

import { Button, TextArea } from "../ui";

import "./MessageComposer.css";

interface MessageComposerProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

const MAX_MESSAGE_LENGTH = 2000;

export default function MessageComposer({
  onSend,
  disabled = false,
  onTypingStart,
  onTypingStop,
}: MessageComposerProps) {
  const [content, setContent] = useState("");

  const [isSending, setIsSending] = useState(false);

  const typingTimeoutRef = useRef<number | null>(null);

  const isTypingRef = useRef(false);

  const notifyTypingActivity = () => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart?.();
    }

    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      isTypingRef.current = false;
      onTypingStop?.();
    }, 1200);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = content.trim();

    if (!trimmed || disabled || isSending) {
      return;
    }

    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    isTypingRef.current = false;
    onTypingStop?.();

    try {
      setIsSending(true);

      await onSend(trimmed);

      setContent("");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      const form = event.currentTarget.form;

      form?.requestSubmit();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);

    if (event.target.value.trim().length > 0) {
      notifyTypingActivity();
    } else {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      isTypingRef.current = false;
      onTypingStop?.();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      if (isTypingRef.current) {
        onTypingStop?.();
      }
    };
  }, [onTypingStop]);

  return (
    <form className="message-composer" onSubmit={handleSubmit}>
      <TextArea
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Write a message..."
        maxLength={MAX_MESSAGE_LENGTH}
        rows={2}
        disabled={disabled || isSending}
      />

      <div className="message-composer__footer">
        <span className="message-composer__count">
          {content.length}/{MAX_MESSAGE_LENGTH}
        </span>

        <Button
          type="submit"
          disabled={disabled || isSending || !content.trim()}
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
}
