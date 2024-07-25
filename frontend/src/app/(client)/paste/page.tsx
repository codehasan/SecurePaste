import CodeEditor from '@/components/CodeEditor/CodeEditor';
import { MemoizedLabel } from '@/components/Label';
import TagInput from '@/components/TagInput/TagInput';
import { newComment } from '@/utils/supabase/actions/pastes';
import classNames from 'classnames';
import styles from '../client.module.css';

const NewPaste = () => {
  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        <div className="text-2xl font-semibold my-8">New paste</div>

        <form className="w-full" action={newComment}>
          <MemoizedLabel
            primaryText="Paste Name"
            topRight="4 character minimum"
            largeText
            required
          >
            <input
              className="input w-full"
              type="text"
              name="title"
              inputMode="text"
              placeholder="Untitled"
              min={4}
              max={100}
              required
            />
          </MemoizedLabel>

          <MemoizedLabel
            primaryText="Paste Body"
            topRight="4 character minimum"
            className="mt-3"
            largeText
            required
          >
            <CodeEditor
              className="bg-white w-full min-h-80"
              name="body"
              inputMode="text"
              minLength={4}
              maxLength={524_288}
              required
            />
          </MemoizedLabel>

          <MemoizedLabel
            primaryText="Syntax Highlight"
            className="mt-3"
            largeText
          >
            <select
              className="select select-text cursor-pointer bg-white w-full"
              name="syntax"
              required
            >
              <option value="plaintext">Text</option>
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
          </MemoizedLabel>

          <MemoizedLabel primaryText="Encryption" className="mt-3" largeText>
            <select
              className="select select-text cursor-pointer bg-white w-full"
              name="encryption"
              required
            >
              <option>Public</option>
              <option>Private</option>
            </select>
          </MemoizedLabel>

          <MemoizedLabel
            primaryText="Tags"
            topRight="10 tags maximum"
            className="mt-3"
            largeText
          >
            <TagInput />
          </MemoizedLabel>

          <div className="w-full flex justify-center">
            <button className="btn btn-primary btn-wide shadow-md m-6">
              Create new paste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPaste;
