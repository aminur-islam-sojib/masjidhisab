"use client";

function scorePassword(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return 1; // weak
  if (score <= 3) return 2; // medium
  return 3; // strong
}

const LEVELS = [
  { label: "", color: "bg-sage-100" },
  { label: "Weak", color: "bg-sage-200" },
  { label: "Medium", color: "bg-sage-400" },
  { label: "Strong", color: "bg-sage-600" },
];

export function PasswordStrength({ password }: { password: string }) {
  const score = scorePassword(password);
  const level = LEVELS[score];

  if (!password) return null;

  return (
    <div className="mt-2 flex items-center gap-2" aria-live="polite">
      <div className="flex flex-1 gap-1.5">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              bar <= score ? level.color : "bg-sage-100"
            }`}
          />
        ))}
      </div>
      <span className="w-14 text-right text-xs text-ink-faint">
        {level.label}
      </span>
    </div>
  );
}