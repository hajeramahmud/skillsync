const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const paths = {
  folder: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  edit: "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z M13.73 21a2 2 0 0 1-3.46 0",
  logIn: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
  logOut: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  user: "M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2",
  userPlus: "M1 21v-2a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v2",
};

function Icon({ name, size = 16, style }) {
  const path = paths[name];

  if (name === "barChart") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...common} style={style}>
        <rect x="4" y="12" width="4" height="8" />
        <rect x="10" y="5" width="4" height="15" />
        <rect x="16" y="9" width="4" height="11" />
      </svg>
    );
  }

  if (name === "plusCircle") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...common} style={style}>
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    );
  }

  if (name === "clipboard") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...common} style={style}>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <rect x="8.5" y="2" width="7" height="3" rx="1" />
      </svg>
    );
  }

  if (name === "user") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...common} style={style}>
        <circle cx="12" cy="8" r="4" />
        <path d={paths.user} />
      </svg>
    );
  }

  if (name === "userPlus") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...common} style={style}>
        <circle cx="8.5" cy="7" r="4" />
        <path d={paths.userPlus} />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="17" y1="11" x2="23" y2="11" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...common} style={style}>
      <path d={path} />
    </svg>
  );
}

export default Icon;
