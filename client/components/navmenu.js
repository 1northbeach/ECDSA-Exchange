import Link from "next/link";
import { useRouter } from "next/router";

function ActiveLink(href, text) {
  const router = useRouter();
  return (
    <Link href={href}>
      <a className={`nav-link ${router.asPath === href ? " active" : ""}`}>
        {text}
      </a>
    </Link>
  );
}

export default function NavMenu() {
  return (
    <header className="masthead mb-auto">
      <div className="inner">
        <h3 className="masthead-brand">
          <Link href="/">
            <a>1Ethereum</a>
          </Link>
        </h3>
        <nav className="nav nav-masthead justify-content-center">
          {ActiveLink("/wallet", "Wallet")}
          {ActiveLink("/send", "Send")}
          {ActiveLink("/mine", "Mine")}
          {ActiveLink("/explorer", "Explorer")}
          {ActiveLink("/about", "About")}
        </nav>
      </div>
    </header>
  );
}
