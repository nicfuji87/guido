// AI dev note: utilidade mínima para unir classes Tailwind (sem dependências externas)
export function cn(...classNames: Array<string | undefined | false | null>): string {
  return classNames.filter(Boolean).join(" ")
}


