import styled from "styled-components";
interface Theme {
  background: string;
  fontColor: string;
  backgroundActive: number;
  backgroundHover: string;
  cursor: string;
}

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  theme: Theme;
}
const Button = styled.div`
  height: 60px;
  line-height: 25px;
  font-size: 24px;
  color: ${(props: ButtonProps) => props.theme.fontColor};
  border-radius: 20px;
  background-color: ${(props: ButtonProps) => props.theme.background};
  cursor: ${(props: ButtonProps) => props.theme.cursor};
  margin: 8px;
  padding: 16px;
  font-weight: 500;
  &:active {
    background-color: ${(props: ButtonProps) => props.theme.backgroundActive};
  }
  &:hover {
    background-color: ${(props: ButtonProps) => props.theme.backgroundHover};
  }
`;

Button.defaultProps = {
  theme: {
    background: "#fb118e",
    fontColor: "#fff",
    backgroundActive: "#ad0bdb",
    backgroundHover: "#fb118e",
    cursor: "pointer",
  },
};

const connectTheme = {
  background: "#fec6e4",
  fontColor: "#fb118e",
  backgroundActive: "#d7bef0",
  backgroundHover: "#f0bed9",
  cursor: "pointer",
};

const approveTheme = {
  background: "#fb118e",
  fontColor: "#fff",
  backgroundActive: "#ad0bdb",
  backgroundHover: "#fb118e",
  cursor: "pointer",
};

const swapTheme = {
  background: "#fb118e",
  fontColor: "#fff",
  backgroundActive: "#ad0bdb",
  backgroundHover: "#fb118e",
  cursor: "pointer",
};

const disabledTheme = {
  background: "#f3f5fc",
  fontColor: "#babfcf",
  backgroundActive: "#f3f5fc",
  backgroundHover: "#f3f5fc",
  cursor: "auto",
};

export { Button, connectTheme, approveTheme, swapTheme, disabledTheme };
