// src/activities/SearchBar.jsx
"use client";

export default function SearchBar({ value, onChange, placeholder = "Search activities..." }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      autoComplete="off"
      aria-label="Search"
    />
  );
}