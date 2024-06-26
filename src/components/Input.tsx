import { HTMLProps, useEffect, useState } from "react";
import { Mail01 } from "@untitled-ui/icons-react";
import { styled } from "@linaria/react";

export default function Input({
  value,
  onChange,
  status,
  onEnter,
  ...props
}: HTMLProps<HTMLInputElement> & Props) {
  const [val, setVal] = useState<string | undefined>();

  useEffect(() => {
    if (val == value) return;
    setVal(value?.toString());
  }, [value]);

  return (
    <Wrapper error={status == "error"}>
      <Content>
        <Label hasContent={typeof val !== "undefined" && val !== ""}>
          Your email (Optional)
        </Label>
        <Icon />
      </Content>
      <InputEl
        type="email"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          if (onChange) onChange(e);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter" || !onEnter) return;
          onEnter();
        }}
        {...(props as any)}
      />
    </Wrapper>
  );
}

const Label = styled.p<{ hasContent: boolean }>`
  position: absolute;
  top: ${(props) => (props.hasContent ? "1rem" : "50%")};
  left: 1.5rem;
  font-size: ${(props) => (props.hasContent ? ".6rem" : "1rem")};
  color: #b5b5b5;
  margin: 0;
  font-weight: 500;
  transform: translateY(${(props) => (props.hasContent ? "0" : "-50%")});
  transition: all 0.17s ease;
`;

const Wrapper = styled.div<{ error: boolean }>`
  position: relative;
  background-color: #f8f8f8;
  border-radius: 17px;
  overflow: hidden;
  transition: all 0.17s ease;
  box-shadow: ${(props) => (props.error ? "0 0 0 2px rgb(191, 0, 0)" : "none")};

  &:focus-within {
    box-shadow: 0 0 0 2px
      rgb(${(props) => (props.error ? "191, 0, 0" : "var(--theme-color)")});

    ${Label} {
      font-size: 0.6rem;
      top: 1rem;
      transform: translateY(0);
    }
  }
`;

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  user-select: none;
`;

const InputEl = styled.input`
  position: relative;
  font-size: 1rem;
  font-weight: 500;
  background-color: transparent;
  border: none;
  color: #000;
  padding: 1.7rem 1.5rem 1.05rem;
  outline: none;
  width: calc(100% - 3rem);
  z-index: 2;
  transition: all 0.17s ease;
`;

const Icon = styled(Mail01)`
  position: absolute;
  color: #b5b5b5;
  top: 50%;
  right: 1.5rem;
  width: 1.5rem;
  height: 1.5rem;
  transform: translateY(-50%);
`;

interface Props {
  status?: "error";
  onEnter?: () => unknown;
}
