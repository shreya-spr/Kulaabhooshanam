"use client"
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import styles from '../../styles/forms.module.css';
import children3 from '../../public/children3.png';

export default function Login() {
  const router = useRouter();
  const UloginID = useRef();
  const ULoginPswd = useRef();
  const AgencyID = useRef();
  const Agencypswd = useRef();

  const [alertMessage, setAlertMessage] = useState('');
  const [roleSelected, setRoleSelected] = useState(false);
  const [selectedRole, setSelectedRole] = useState();

  async function getUser() {
    if (selectedRole === 'parent') {
      try {
        const pid = UloginID.current.value.trim();
        const pswd = ULoginPswd.current.value.trim();

        const postData = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pid: pid,
            pswd: pswd,
          }),
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/login`, postData);


        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }

        const response = await res.json();
        console.log('POST --- API Response:', response);

        if (response.message === 'User Does Not exist') {
          console.error('API Error:', response.message);
          setAlertMessage('User ID does not exist. Please try again.');
          return;
        }

        if (response.message === 'LOGIN VALID') {
          const name = response.name;
          localStorage.setItem('loginResponse', JSON.stringify(response));
          localStorage.setItem('authenticated', 'true');
          localStorage.setItem('isagency', 'false');
          router.push('/');
        }
        else {
          localStorage.setItem('authenticated', 'false');
          localStorage.setItem('isagency', 'false');
        }
      } catch (error) {
        console.error('POST -- Error fetching data:', error);
      }
    }

    if (selectedRole === 'agency') {
      try {
        const aid = AgencyID.current.value.trim();
        const pswd = Agencypswd.current.value.trim();

        const postData = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aid: aid,
            pswd: pswd,
          }),
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/agencylogin`, postData);

        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }

        const response = await res.json();
        console.log('POST --- API Response:', response);

        if (response.message === 'User Does Not exist') {
          console.error('API Error:', response.message);
          setAlertMessage('User ID does not exist. Please try again.');
          console.log(alertMessage);
          return;
        }

        if (response.message === 'LOGIN VALID') {
          const name = response.name;
          localStorage.setItem('loginResponse', JSON.stringify(response));
          localStorage.setItem('authenticated', true);
          localStorage.setItem('isagency', true);
          localStorage.setItem('agencyid', name)
          router.push('/');
        }
        else {
          localStorage.setItem('authenticated', false);
          localStorage.setItem('isagency', false);
        }
      } catch (error) {
        console.error('POST -- Error fetching data:', error);
      }
    }
  }
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setRoleSelected(true);
  };
  
  
  return (
    <>
      <main className = {styles.mainBox}>
        <form className = {styles.formElement} onSubmit = {getUser} method = "GET">
          <div className = {styles.formContainer}>
            <div className = {styles.headingContainer}>
              <h1 className = {styles.h1}>Kulaabhooshanam</h1>
              <p className = {styles.pTag}>Building relationships, one family at a time.</p>
            </div>

            <div className = {styles.inputsContainer}>
              <div>
              <div>
              <div className = {styles.inputDivs}>
                <label htmlFor = "role">Select your role:</label>
                <p></p>
                <select
                  className = {styles.inputBox}
                  name = "role"
                  onChange = {(e) => handleRoleSelect(e.target.value)}
                >
                  <option value = 'select'>Select</option>
                  <option value="agency">Agency</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
              {roleSelected && (
                <div>
                  {selectedRole === 'parent' ? (
                    <>
                      <div className={styles.inputDivs}>
                        <label htmlFor="p_id">Enter your ID(Aadhar Number)</label>
                        <p></p>
                        <input
                          className={styles.inputBox}
                          type="text"
                          ref={UloginID}
                          placeholder="4222 2224 4222"
                          required
                          pattern="[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}"
                        />
                      </div>
                      <div className={styles.inputDivs}>
                        <label htmlFor="pswd">Enter your password</label>
                        <p></p>
                        <input
                          className={styles.inputBox}
                          type="text"
                          ref={ULoginPswd}
                          placeholder="########"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.inputDivs}>
                        <label htmlFor="agency_id">Enter your registered agency ID</label>
                        <p></p>
                        <input
                          className={styles.inputBox}
                          type="number"
                          ref={AgencyID}
                          placeholder=""
                          required
                        />
                      </div>
                      <div className = {styles.inputDivs}>
                        <label htmlFor = "agpswd">Enter your password</label>
                        <p></p>
                        <input
                          className={styles.inputBox}
                          type = "text"
                          ref = {Agencypswd}
                          placeholder = "########"
                          required
                        />
                      </div>
                    </>
                  )} <></>
                  <div className={styles.saveButton}>
                    <input value = "Login" type = "button" onClick = {getUser} />
                  </div>
                </div>
              )}
              </div>
              </div>
            </div>
          </div>
          <div className = {styles.formImage}>
                <Image src = {children3} alt = "Family Form Image" />
              </div>
        </form>
      </main>
    </>
  );
}
