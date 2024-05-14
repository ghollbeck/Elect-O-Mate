import React from 'react';

export default function App() {
  return (
    <footer className="bg-gray-800 text-center text-white py-4">
      <div className="container mx-auto p-4">
        <section className="mb-4">
          <form action="">
            <div className="flex justify-center items-center">
              <div className="mr-2">
                <p className="pt-2">
                  <strong>Sign up for our newsletter</strong>
                </p>
              </div>
              <div className="relative">
                <input
                  type="email"
                  className="mb-4 p-2 rounded-sm text-gray-800"
                  placeholder="Email address"
                />
              </div>
              <div className="ml-2">
                <button
                  type="submit"
                  className="mb-4 px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-gray-800 transition duration-300"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </form>
        </section>
        <section className="mb-4">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </section>
      </div>
      <div className="bg-gray-900 text-center p-3">
        © 2020 Copyright: 
        <a className="text-white ml-2" href="https://elect-o-mate.eu/">
          Elect-O-Mate
        </a>
      </div>
    </footer>
  );
}
