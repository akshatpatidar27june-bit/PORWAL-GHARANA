"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import styles from "./login.module.css";

export default function AdminLogin(){
 const router=useRouter();const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [loading,setLoading]=useState(false);const [message,setMessage]=useState("");
 useEffect(()=>{if(!supabase)return;supabase.auth.getUser().then(({data})=>{if(data.user)router.replace("/admin")})},[router]);
 async function submit(e:FormEvent){e.preventDefault();setMessage("");if(!supabase){setMessage("Supabase is not configured yet.");return}setLoading(true);const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)setMessage(error.message);else router.replace("/admin");setLoading(false)}
 return <main className={styles.page}><form className={styles.card} onSubmit={submit}><div className={styles.mark}>PG</div><p className={styles.eyebrow}>PORWAL GHARANA</p><h1>Admin sign in</h1><p className={styles.sub}>Use the Supabase email + password created for your store admin account.</p><label>Email<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@porwalgharana.com" required/></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" required/></label>{message&&<div className={styles.error}>{message}</div>}<button className={styles.submit} disabled={loading}>{loading?"Signing in…":"Sign in securely"}</button><a href="/" className={styles.back}>← Back to store</a></form></main>;
}
