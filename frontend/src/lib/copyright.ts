export const getCopyrightText = () => {
  const projectCreated = 2024;
  const currentYear = new Date().getFullYear();

  if (projectCreated === currentYear) {
    return `Copyright © ${currentYear} SecurePaste, All right reserved.`;
  }

  return `Copyright © ${projectCreated}-${currentYear} SecurePaste, All right reserved.`;
};
