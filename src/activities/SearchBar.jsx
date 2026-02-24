"use client";

import { useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import styles from "./SearchBar.module.scss";

export default function SearchBar({ value, onChange, open, onOpen, onClose, placeholder = "Søg..." }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <button type="button" className={styles.iconBtn} onClick={onOpen} aria-label="Åbn søgning">
        <FiSearch />
      </button>
    );
  }

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Søg"
        className={styles.input}
      />
      <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Luk søgning">
        <FiX />
      </button>
    </div>
  );
}
