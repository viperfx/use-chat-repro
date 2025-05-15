"use client";

import Image from "next/image";
import styles from "../../page.module.css";

import { useAppContext } from "../../context/AppContext";
import Link from "next/link";

export default function Chat() {
  const { messages, conversationId, keys } = useAppContext();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>The conversation id is {conversationId}.</li>
          {messages.map((message) => (
            <ol key={message.id}>
              {message.parts?.map((part, idx) => (
                <li key={idx}>{part?.text}</li>
              ))}
            </ol>
          ))}
        </ol>
      </main>
      <footer className={styles.footer}>
        {keys.map((key) => (
          <Link href={`/chat/${key}`}>{key}</Link>
        ))}
      </footer>
    </div>
  );
}
