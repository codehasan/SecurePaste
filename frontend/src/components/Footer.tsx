import { getCopyrightText } from '@/lib/copyright';
import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { MdMail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="footer footer-center bg-gray-100 text-base-content rounded p-10 border-t border-solid border-t-stone-300">
      <nav className="grid grid-flow-col gap-4">
        <a className="link link-hover" href="/about_us">
          About us
        </a>
        <a
          className="link link-hover"
          href="mailto:ratul.hasan.rahat.bd@gmail.com"
        >
          Contact developer
        </a>
        <a
          className="link link-hover"
          href="https://github.com/codehasan/SecurePaste"
        >
          Source code
        </a>
        <a className="link link-hover" href="/faqs">
          FAQs
        </a>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4 place-items-center">
          <a className="link" href="https://github.com/codehasan">
            <FaGithub className="size-6 hover:text-gray-700" />
          </a>
          <a className="link" href="https://twitter.com/code_hasan">
            <FaTwitter className="size-6 hover:text-gray-700" />
          </a>
          <a className="link" href="https://www.linkedin.com/in/codehasan">
            <FaLinkedin className="size-6 hover:text-gray-700" />
          </a>
          <a className="link" href="mailto:ratul.hasan.rahat.bd@gmail.com">
            <MdMail className="size-7 hover:text-gray-700" />
          </a>
        </div>
      </nav>
      <aside>
        <p>{getCopyrightText()}</p>
      </aside>
    </footer>
  );
};

export default Footer;
