import React from 'react';

export default function App() {
  return (
    <footer className="bg-gray-800 text-center text-white">
      <div className="container mx-auto">
        <section className="mb-4">
          <form action="">
            <div className="mb-4">
              <p className="pt-2">
                <strong>Sign up for impotant updates </strong>
              </p>
            </div>
            <div className="flex justify-center items-center">
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
            Made with love from people all over the world.
          </p>
        </section>
      </div>
      <div className="bg-gray-900 text-center">
        © 2024 Copyright: 
        <a className="text-white ml-2" href="https://elect-o-mate.eu/">
          Elect-O-Mate
        </a>
      </div>
    </footer>
  );
}