import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

import * as React from "react"

export const ParticipantsEmail = ({
  content,
  eventUrl,
}: {
  content: string
  eventUrl: string
}) => (
  <Html>
    <Head />
    {/* <Preview>
      A fine-grained personal access token has been added to your account
    </Preview> */}
    <Body style={main}>
      <Container style={container}>
        <Section style={section}>
          <Text style={text}>
            {" "}
            <p>
              {content.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </Text>
        </Section>

        <Text style={footer}>
          You received this email because you showed interest in{" "}
          <a
            href={eventUrl}
            target="_blank"
            className="underline hover:no-underline"
          >
            this event
          </a>{" "}
          from{" "}
          <a
            className="underline hover:no-underline"
            target="_blank"
            href="https://ethical-digital-nation.vercel.app/"
          >
            Ethical Digital Nation Collaborative Web App
          </a>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ParticipantsEmail

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
}

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
}

const section = {
  padding: "12px",
  borderRadius: "4px",
  textAlign: "left" as const,
}

const text = {
  padding: "5px",
  margin: "0 0 10px 0",
  textAlign: "left" as const,
}

const footer = {
  color: "#6a737d",
  fontSize: "10px",
  textAlign: "center" as const,
  marginTop: "60px",
}
