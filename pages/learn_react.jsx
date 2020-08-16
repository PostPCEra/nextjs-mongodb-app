import React, { Component, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useCurrentUser } from '../lib/hooks';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";


let global_count = 555 ;

const ProfileSection = () => {
  const [user, { mutate }] = useCurrentUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const nameRef = useRef();
  const bioRef = useRef();
  const [msg, setMsg] = useState({ message: '', isError: false });

  useEffect(() => {
    nameRef.current.value = user.name;
    bioRef.current.value = user.bio;
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    const formData = new FormData();

    formData.append('name', nameRef.current.value);
    formData.append('bio', bioRef.current.value);
    const res = await fetch('/api/user', {
      method: 'PATCH',
      body: formData,
    });
    if (res.status === 200) {
      const userData = await res.json();
      mutate({
        user: {
          ...user,
          ...userData.user,
        },
      });
      setMsg({ message: 'Profile updated' });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };


  async function sendVerificationEmail() {
    await fetch('/api/user/email/verify', {
      method: 'POST',
    });
  }

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <section>
        <h2>Upload CODE 22.................</h2>
        {msg.message ? <p style={{ color: msg.isError ? 'red' : '#0070f3', textAlign: 'center' }}>{msg.message}</p> : null}
        <form onSubmit={handleSubmit}>
          {!user.emailVerified ? (
            <p>
              Your email has not been verify.
              {' '}
              {/* eslint-disable-next-line */}
                <a role="button" onClick={sendVerificationEmail}>
                  Send verification email
                </a>
            </p>
          ) : null}
          <label htmlFor="name">
            Name
            <input
              required
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              ref={nameRef}
            />
          </label>
          <label htmlFor="bio">
            Bio
            <textarea
              id="bio"
              name="bio"
              type="text"
              wrap="hard"
              placeholder="Bio"
              ref={bioRef}
            />
          </label>
          
          <button id="profileSubmit" disabled={isUpdating} type="submit">Save</button>
        </form>
      
      </section>
    </>
  );
};

const SettingPage = () => {
  const [user] = useCurrentUser();
  

  if (!user) {
    return (
      <>
        <p>Please sign in</p>
      </>
    );
  }
  
  const codeval = user.bio ;
  return (
    <>
      <h1>Settings</h1>
      <ProfileSection />

      <ClassComp count={6} cnt={12} code={codeval}/>

    </>
  );
};

class ClassComp extends Component {

  constructor(props) {
      super(props);
      this.addOne = this.addOne.bind(this);
      this.addCode = this.addCode.bind(this);
  
      
      /* count: 0,
        code : 'fun add(a,b) {  int i = 9; }',
        cnt : 222
      */
      this.state = {
        code : this.props.code,  
        cnt : this.props.cnt,
        count : this.props.count

        
      };

      this.aceEditorRef = React.createRef();

    }

  addOne() {

      this.setState({
        count: this.state.count + 1
      });
  };
  
  addCode() {

  
      const txtval = this.aceEditorRef.current.editor.session.getDocument().getValue();
      document.getElementById("bio").value = txtval ;
      document.getElementById("profileSubmit").click() ;

      /*
       const txt = 'myfun add(a,b) { int i = 2; }' ;

      //const todoitems = useStoreState(state => state.todos.items);
      //const txt =  todoitems[0].text ;


       const edtr = this.aceEditorRef.current.editor ;
       let pos = edtr.getCursorPosition();
       console.log(pos);
  
       let pos2 = { row: 5, col: 4 } ;
       edtr.session.insert(pos2, txt);
  */
       // this.aceEditorRef.current.editor.session.insert(pos, txt);
      // this.aceEditorRef.current.editor.session.getDocument().setValue(txt);
  
  };

    render() {

      
      return (
          <>
          <h1> Level 2 : I am Class Component 55 </h1>
          state.count value: --{this.state.count}--
          <br/><br/>

          {/* you can make this HIDDEN button size as 1 pixel, so it won't take screen space */}
          right to here, a Buton is hidden:-- 
          <button id="triggers_rerender" style={{ visibility: false ? "visible" : "hidden" }}  onClick={this.addOne}>update State, so it will re-render</button>
          
          <h4> --global_count vlaue is: {global_count}</h4>
            
            
         <button onClick={this.addCode}>Add code ...</button> 
            
        

          <AceEditor
              mode="javascript"
              theme="github"
              ref={this.aceEditorRef}

              name="mydiv"
              defaultValue={this.state.code}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true
              }}
          />

          </>
      )
    }  
}

export default SettingPage;
