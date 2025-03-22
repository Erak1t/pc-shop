import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home">
      <section className="banner1-home">
        <div className="left-side-content">
          <h1>New High-Performance Laptop</h1>
          <p>
            Experience the ultimate gaming and productivity with our latest
            laptop model
          </p>
          <span>$999.99</span>
          <button>Buy Now</button>
        </div>
        <div className="right-side-content">
          <img src="/" alt="Image of Pruduct" />
        </div>
      </section>
    </main>
  );
}
