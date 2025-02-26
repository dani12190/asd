export const cn = (...inputs: (string | undefined | null)[]) => {
  return inputs.filter(Boolean).join(" ")
}

