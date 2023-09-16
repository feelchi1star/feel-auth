import { CounterButton, Link } from "ui";

export default function Index(): JSX.Element {
  return (
    <div className="container">
      <h1 className="title">
        @feel-auth/blog <br />
        <span>This is the Blogs Pages</span>
      </h1>
      {/* <CounterButton /> */}
      <h2>Coming Soon!!!</h2>
      <p className="description">
        Built With <Link href="https://turbo.build/repo">Turborepo</Link>
        {" & "}
        <Link href="https://remix.run/">Remix</Link>
      </p>
    </div>
  );
}
