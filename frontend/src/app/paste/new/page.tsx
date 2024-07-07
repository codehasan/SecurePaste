import CodeEditor from '@/components/CodeEditor/CodeEditor';
import TagInput from '@/components/TagInput/TagInput';
import React from 'react';

const NewPaste = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <h1 className="text-xl font-medium mb-4">Create New Paste</h1>

      <div className="form-control w-full max-w-screen-lg px-8">
        <div className="label">
          <span className="label-text text-base">
            <span className="mr-2">Paste Name</span>
            <span className="badge badge-info">Required</span>
          </span>
          <span className="label-text-alt">4 character minimum</span>
        </div>
        <input
          type="text"
          placeholder="Untitled"
          className="input input-bordered w-full mb-3"
          minLength={4}
          maxLength={100}
        />

        <div className="label">
          <span className="label-text text-base">
            <span className="mr-2">Paste Body</span>
            <span className="badge badge-info">Required</span>
          </span>
          <span className="label-text-alt">4 character minimum</span>
        </div>
        <CodeEditor className="w-full mb-3 min-h-80" minLength={4} />

        <div className="label">
          <span className="label-text text-base">Syntax Highlight</span>
        </div>
        <select className="select select-bordered w-full mb-3">
          <option value="plaintext" selected>
            Text
          </option>
          <option value="bash">Bash</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="css">CSS</option>
          <option value="dart">Dart</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
          <option value="javascript">Javascript</option>
          <option value="kotlin">Kotlin</option>
          <option value="lua">Lua</option>
          <option value="matlab">MATLAB</option>
          <option value="objectivec">Objective-C</option>
          <option value="perl">Perl</option>
          <option value="php">PHP</option>
          <option value="powershell">Powershell</option>
          <option value="python">Python</option>
          <option value="r">R</option>
          <option value="ruby">Ruby</option>
          <option value="rust">Rust</option>
          <option value="scala">Scala</option>
          <option value="scss">SCSS</option>
          <option value="shell">Shell</option>
          <option value="swift">Swift</option>
          <option value="typescript">Typescript</option>
          <option value="vim">Vim</option>
          <option value="xml">XML</option>
          <option value="yaml">Yaml</option>
        </select>

        <div className="label">
          <span className="label-text text-base">Encryption</span>
        </div>
        <select className="select select-bordered w-full mb-3">
          <option selected>Public / No Encryption</option>
          <option>Private / Encrypted</option>
        </select>

        <div className="label">
          <span className="label-text text-base">Tags</span>
          <span className="label-text-alt">10 tags maximum</span>
        </div>
        <TagInput />

        <div className="w-full flex justify-center">
          <button className="btn btn-primary btn-wide shadow-md m-6">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPaste;
