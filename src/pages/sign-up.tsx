import React, { SyntheticEvent, useReducer } from 'react';
import { signIn } from 'next-auth/react';

function FormComponent() {
    const handleFormSubmit = async (e: SyntheticEvent)=>{
        e.preventDefault();
        const { password, ...others }: any = state;
        if (password !==others['confirm-password']) {
            dispatch({name:'response',value:{code:401,message:"Passwords don't match!!"}})
        }
        type sentResponse = Omit<FormComponents,'confirm-password'|'response'| 'passwordType'>
        const sendingResp: sentResponse = {
            name: state.name,
            email: state.email,
            password: state.password,

        }
        const res = await fetch('/api/auth/signup',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({...sendingResp})
        })
        const data = await res.json();
        console.log(data.message,res.status);
        if (res.status===(200| 201)) {
            //sign in the user
            // const status = await signIn('credentials', {
            //     redirect: false,
            //     email: state.email,
            //     password: state.password
            // })
            // console.log(status);
        }

        dispatch({name:'response',value:{code:res.status,message:data.message}})
    }
    type FormComponents={
        name: string
        email: string
        password: string
        "confirm-password": string
        response: {
            code: number,
            message: string
        }
    }
    const formVals: FormComponents={
        name: '',
        email: '',
        password: '',
        'confirm-password': '',
        response: {
            code: 0,
            message: ''
        },
    }
    function signInReducer(prev: FormComponents,next: {name :string,value: string | {code:number,message:string} | boolean}) {
        return {
            ...prev,
            [next.name]: next.value
        }
    }
    const [state, dispatch]: any = useReducer(signInReducer, formVals)
    function handleOnChange(e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement>){
        if (e.target instanceof HTMLSelectElement) {
            dispatch({name: e.target.name,value: e.target.value})
           return;
        }
        const {name,value} = e.target as HTMLTextAreaElement
        dispatch({name: name ,value: value})
    }

    return (
        <>

            <div>
                <form onSubmit={handleFormSubmit}>
                    <p style={{fontWeight: 'bold', fontSize: '20px'}}>Create an Account Today!!</p>
                    {/* {
                        state.response.message?(
                            <p  className={state.response.code===201? styles.success_message:styles.failure_message}>{state.response.message}</p>
                        ):''
                    } */}
                    <div>
                        <label>Name</label>
                        <input name='name' value={state.name} required type="text" onChange={handleOnChange} />
                    </div>
                    <div>
                        <label>Email</label>
                        <input name='email' value={state.email} required type="email" onChange={handleOnChange}/>
                    </div>

                    <div>
                        <label >Password</label>
                        <input name='password' value={state.password} required type="password" onChange={handleOnChange} />
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <input name='confirm-password' value={state['confirm-password']} required type="password" onChange={handleOnChange} />
                    </div>

                    <input required type="submit" value="SIGN UP" />
                </form>
                <button onClick={() => signIn()}>Sign in</button>
            </div>
        </>
    );
}

export default FormComponent;