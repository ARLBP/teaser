import { css } from "@linaria/core"
import { styled } from "@linaria/react"
import Button from "./Button"
import Card from "./Card"
import Avatars from "./Avatars"

export default function App() {
  return (
    <Wrapper>
      <div>
        <Title>
          Lending on Arweave
        </Title>
        <Subtitle>
          The very first lending protocol built on the ao supercomputer
        </Subtitle>
      </div>
      <Card>
        <JoinContent>
          <SectionTitle>
            Join the waitlist!
          </SectionTitle>
          <Paragraph>
            Subscribe to our newsletter to know when we are ready. Don't worry, we won't spam you and that's guaranteed!
          </Paragraph>
          <Avatars />
          <Small>
            Join Sam Williams, Tate Berenbaum and more...
          </Small>
          <JoinButton>
            Connect
          </JoinButton>
        </JoinContent>
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  gap: 4rem;

  @media screen and (max-width: 720px) {
    padding: 0 10vw;
  }
`;

const JoinContent = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 5.5rem;
  text-align: center;
  margin: 0 0 .4rem;
  color: #000;
  font-weight: 700;
`;

const Subtitle = styled.h2`
  font-size: 1.8rem;
  text-align: center;
  margin: 0;
  color: #B5B5B5;
  font-weight: 500;
`;

const SectionTitle = styled.h3`
  font-size: 2.1rem;
  text-align: center;
  margin: 0 0 .6rem;
  color: #000;
  font-weight: 600;
`;

const Paragraph = styled.p`
  text-align: center;
  color: #B5B5B5;
  width: 30vw;
  line-height: 1.45em;
  margin: 0;

  @media screen and (max-width: 720px) {
    width: auto;
  }
`;

const Small = styled(Paragraph)`
  font-size: .75rem;
`;

const JoinButton = styled(Button)`
  margin: 1rem auto 0;
`;

export const globals = css`
  :global() {
    html {
      box-sizing: border-box;
      --theme-color: 0, 10, 255;
    }

    body {
      margin: 0;
      font-family: 'Eudoxus Sans', system-ui, sans-serif;
      font-weight: 500;
      overflow-x: hidden;
      background-color: #F5F5F5;
    }

    input, select, textarea {
      font-family: 'Eudoxus Sans', system-ui, sans-serif !important;
    }

    a {
      -webkit-tap-highlight-color: transparent;
    }

    ::selection {
      background-color: rgba(var(--theme-color), .3);
      color: rgb(var(--theme-color));
    }
  }
`;
