import { type SubmitEvent, useState, type KeyboardEvent } from "react";

import { Button, TextArea } from "../ui";

import "./MessageComposer.css";

interface MessageComposerProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}

const MAX_MESSAGE_LENGTH = 2000;

export default function MessageComposer({
  onSend,
  disabled = false,
}: MessageComposerProps) {
  const [content, setContent] = useState("");

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = content.trim();

    if (!trimmed || disabled || isSending) {
      return;
    }

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

  return (
    <form className="message-composer" onSubmit={handleSubmit}>
      <TextArea
        value={content}
        onChange={(event) => setContent(event.target.value)}
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
