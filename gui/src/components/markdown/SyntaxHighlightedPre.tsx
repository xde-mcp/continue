import { useContext } from "react";
import styled from "styled-components";
import { vscForeground } from "..";
import { VscThemeContext } from "../../context/VscTheme";

const StyledPre = styled.pre<{ theme: any }>`
  & .hljs {
    color: ${vscForeground};
  }

  // TODO: Verify this is okay when the filename header isn't displayed above
  margin-top: 0px;

  ${(props) =>
    Object.keys(props.theme)
      .map((key, index) => {
        return `
      & ${key} {
        color: ${props.theme[key]};
      }
    `;
      })
      .join("")}
`;

export const SyntaxHighlightedPre = (props: any) => {
  const currentTheme = useContext(VscThemeContext);

  return <StyledPre {...props} theme={currentTheme} />;
};
