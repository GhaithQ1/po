import React from "react";
import "./Loading_Bookmark.css";
const Loading_Bookmark = () => {
  return (
    <div className="bookmark-checkbox">
  <label className="bookmark-checkbox__label">
    <svg className="bookmark-checkbox__icon" viewBox="0 0 24 24">
      <path className="bookmark-checkbox__icon-back"
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 1 1 1 2 2z">
      </path>
      <path className="bookmark-checkbox__icon-check" d="M8 11l3 3 5-5"></path>
    </svg>
  </label>
</div>
  );
};

export default Loading_Bookmark;
