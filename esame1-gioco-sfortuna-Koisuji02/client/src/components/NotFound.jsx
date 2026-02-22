// nel NotFound non ho usato "nulla" di React, ma una sintassi più semplice in quanto ho solo degli h e p (testo statico)
export default function NotFound() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center beach-bg notfound-container">
      <h1 className="notfound-404 beach-title mb-2">
        <span className="notfound-four">4</span>
        <span role="img" aria-label="smiling face with sunglasses" className="notfound-sun">😎</span>
        <span className="notfound-four">4</span>
      </h1>
      <p className="notfound-lead beach-home-msg mb-1">Page Not Found</p>
      <p className="notfound-desc beach-home-msg">
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
