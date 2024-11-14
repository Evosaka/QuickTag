import styled from "styled-components";

export const Title = styled.h1<{ $align?: string }>`
  font-size: 15px;
  text-align: ${(props) => props.$align || "left"};
`;

export const ButtonView = styled.div<{ $backgroundColor?: string }>`
  background-color: ${(props) => props.$backgroundColor || "transparent"};
  border-radius: 5px;
  padding: 10px;
  justify-items: center;
  align-items: center;
`;

export const InputView = styled.div<{
  $backgroundColor?: string;
  $error?: string;
}>`
  background-color: ${(props) => props.$backgroundColor || "transparent"};
  border-color: ${(props) => props.$error && "red"};
  border-radius: 5px;
  border-width: 0.5px;
`;

export const Text = styled.h1<{ $textColor?: string }>`
  color: ${(props) => props.$textColor || "white"};
  font-weight: 500;
  font-size: 14px;
`;
