import { useActiveAddress, useConnection, usePublicKey, useStrategy } from "@arweave-wallet-kit-beta/react";
import { Paragraph, SectionTitle, Title } from "./Text";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedCheck from "./AnimatedCheck";
import { styled } from "@linaria/react";
import Wrapper from "./Wrapper";
import Spacer from "./Spacer";
import Dialog from "./Dialog";
import Button from "./Button";
import Input from "./Input";
import Card from "./Card";

export default function Home() {
  const { connect, connected } = useConnection();
  const address = useActiveAddress();
  const publicKey = usePublicKey();
  const [email, setEmail] = useState<string | undefined>();
  const strategy = useStrategy();

  const [emailStatus, setEmailStatus] = useState<"error" | undefined>()

  async function subscribe() {
    if (!email?.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      return setEmailStatus("error");
    } else if (emailStatus === "error") {
      setEmailStatus(undefined);
    }

    if (!connected) await connect();

    // @ts-expect-error
    const signature = await window.arweaveWallet.signMessage(
      new TextEncoder().encode(address)
    );

    const res = await (
      await fetch(
        `https://waitlist-server.lorimer.pro/record-address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            owner: publicKey,
            signature: Array.from(signature),
            walletAddress: address,
            mode: strategy
          })
        }
      )
    ).json();

    console.log(res);
  }

  const [users, setUsers] = useState<{ address: string; balance: number; }[]>([]);

  useEffect(() => {
    (async () => {
      const res = await (
        await fetch("https://waitlist-server.lorimer.pro/get-address-list")
      ).json();

      setUsers(res);
    })();
  }, []);

  const [arPrice, setArPrice] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await (
          await fetch("https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd")
        ).json();

        if (!res?.arweave?.usd) {
          throw new Error("");
        }

        localStorage.setItem("ar_price_cache", res.arweave.usd.toString());
        setArPrice(res.arweave.usd);
      } catch {
        const cached = localStorage.getItem("ar_price_cache");

        setArPrice(cached ? parseFloat(cached) : 0);
      }
    })();
  }, []);

  const [stats, setStats] = useState<{ users: number; arTokens: number }>({
    users: 0,
    arTokens: 0
  });

  useEffect(() => {
    (async () => {
      const res = await (
        await fetch("https://waitlist-server.lorimer.pro/waitlist-stats")
      ).json();

      if (typeof res?.users !== "undefined" && typeof res?.arTokens !== "undefined")
        setStats(res);
    })();
  }, []);

  const [joined, setJoined] = useState(false);

  return (
    <>
      <Wrapper>
        <div>
          <Title>
            Name
          </Title>
          <Spacer y={0.4} />
          <Paragraph>
            Name is the very first lending protocol on Arweave and the AO computer
          </Paragraph>
        </div>
        <Form>
          <SectionTitle>
            Join the waitlist!
          </SectionTitle>
          <Spacer y={0.6} />
          <Paragraph>
            Subscribe to our newsletter to know when we are ready. Don't worry, we won't spam you and that's guaranteed!
          </Paragraph>
          {(!joined && (
            <>
              <Spacer y={1.5} />
              <Input
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                status={emailStatus}
                onEnter={subscribe}
              />
              <Spacer y={1.5} />
              <Button onClick={subscribe}>
                {connected ? "Sign up" : "Connect"}
              </Button>
            </>
          )) || (
            <>
              <Spacer y={1.5} />
              <AnimatedCheck />
              <Spacer y={.7} />
              <Paragraph>
                You've joined successfully! See you soon!
              </Paragraph>
            </>
          )}
        </Form>
        <Spacer y={.01} />
        <Leaderboard>
          <Stats>
            <Stat>
              <h4>{stats.users.toLocaleString()}</h4>
              <Paragraph>
                Users
              </Paragraph>
            </Stat>
            <Stat>
              <h4>
                {(stats.arTokens * arPrice).toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                  currencyDisplay: "narrowSymbol",
                  maximumFractionDigits: 2
                }) + " USD"}
              </h4>
              <Paragraph>
                Total user wealth
              </Paragraph>
            </Stat>
          </Stats>
          <Spacer y={1} />
          <Table>
            <tr>
              <th></th>
              <th>Address</th>
              <th>USD Balance</th>
              <th>AR Balance</th>
            </tr>
            <AnimatePresence>
              {users.map((p, i) => (
                <motion.tr
                  initial={{ opacity: 0, scale: .93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: .93 }}
                  key={i}
                >
                  <td>{i + 1}.</td>
                  <td>{formatAddress(p.address, 9)}</td>
                  <td>
                    {(p.balance * arPrice).toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                      currencyDisplay: "narrowSymbol",
                      maximumFractionDigits: 2
                    }) + " USD"}
                  </td>
                  <td>{p.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} AR</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </Table>
          <Spacer y={1} />
        </Leaderboard>
      </Wrapper>
      <Dialog />
    </>
  );
}

const Form = styled(Card)`
  padding: 2rem;

  ${Button} {
    margin: 0 auto;
  }

  @media screen and (max-width: 1250px) {
    width: 70%;
  }

  @media screen and (max-width: 720px) {
    width: 100%;
  }
`;

const Leaderboard = styled(Card)`
  @media screen and (max-width: 1250px) {
    width: 70%;
  }

  @media screen and (max-width: 720px) {
    width: 100%;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-bottom: 1px solid #eaecf0;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.2rem 0;
  gap: .4rem;

  &:first-child {
    border-right: 1px solid #eaecf0;
  }

  h4 {
    font-size: 2rem;
    margin: 0;
    text-align: center;
  }
`;

const Table = styled.table`
  margin: 0 2rem;
  width: calc(100% - 4rem);
  border-collapse: collapse;
  overflow-x: auto;

  tr {
    border-bottom: 1px solid #eaecf0;

    &:last-child {
      border-bottom: 0;
    }

    td, th {
      font-weight: 500;
      font-size: .9rem;
      color: #000;
      line-height: 1.45em;
      text-align: left;
      padding: .75rem;

      &:nth-child(3), &:nth-child(4) {
        text-align: right;
      }
    }

    th {
      font-weight: 400;
      color: #B5B5B5;
      padding-top: 0;
    }
  }
`;

function formatAddress(address: string, count = 13) {
  return (
    address.substring(0, count) +
    "..." +
    address.substring(address.length - count, address.length)
  );
}
