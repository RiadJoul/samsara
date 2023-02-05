import Button from '@/components/Button';
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { firebaseConfig } from '@/firebaseConfig';

import { initializeApp } from "firebase/app";
import { collection, addDoc, getFirestore, query, where, getDocs } from 'firebase/firestore';
import { validateAge } from '@/validateAge';
import { validateEmail } from '@/validateEmail';

export default function Home() {
  const [step, setStep] = useState<number>(0);

  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [email, setEmail] = useState<string>();
  const [checked, setChecked] = useState(false);

  const [formOpacity, setFormOpacity] = useState<boolean>(false);
  const [introOpacity, setIntroOpacity] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const moveToNextSection = () => {
    const nameRegex = "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$"
    //validation
    switch (step) {
      case 0:
        setStep(step => step + 1)
        break;
      case 1:
        if (!firstName || !firstName?.match(nameRegex)) {
          setErrorMessage('Please enter a valid first name')
          return;
        }
        if (!lastName || !lastName?.match(nameRegex)) {
          setErrorMessage('Please enter a valid last name')
          return
        }
        setStep(step => step + 1)
        setErrorMessage('')
        break;
      case 2:
        if (!dateOfBirth) {
          setErrorMessage('Please enter your date of birth')
          return
        }
        if (!validateAge(dateOfBirth!)) {
          setErrorMessage('You cannot register if you are under 18 years old')
          return
        }
        setStep(step => step + 1)
        setErrorMessage('')
        break;
      case 3:
        if (!email || !validateEmail(email!)) {
          setErrorMessage('Please enter a valid Email')
          return
        }
        if (!checked) {
          setErrorMessage('Please agree to the terms and conditions')
          return
        }

        setErrorMessage('')
        sendData();


        break;

      default:
        break;
    }


  }

  const sendData = async () => {
    let id;
    setLoading(true)
    setErrorMessage('')
    //sending data to firestore
    try {
      const usersRef = collection(db, "users");

      // Create a query against the collection.
      const q = query(usersRef, where("email", "==", email));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        // doc.data() is never undefined for query doc snapshots
        id = doc.id
      });

      //check if the user is already registered
      if (id) {
        setErrorMessage('You are already registered')
      } else {
        await addDoc(collection(db, "users"), {
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          email: email,
        });
        setStep(step => step + 1)
      }


    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setLoading(false)
  }

  useEffect(() => {
    setTimeout(() => {
      if (step == 1 || step == 2) {
        setFormOpacity(true)
      }
    }, 500);
  }, [step])

  useEffect(() => {
    setTimeout(() => {
      setIntroOpacity(true)
    }, 500);
  }, [introOpacity])

  return (
    <>
      <Head>
        <title>Samsara</title>
        <meta name="description" content="The AI powered dating app that finds your soul mate" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`bg-black h-screen flex flex-col justify-end lg:justify-center items-center space-y-8 lg:pb-0 ${step == 4 ? "pb-10" : "pb-28"}`}>

        {/* Intro */}

        <div className={`flex flex-col justify-center space-y-20 ${introOpacity ? "opacity-100" : "opacity-0"} transition-opacity ease-in duration-700 mx-auto px-10 lg:w-1/3`}>

          <div className='flex justify-center'>
            <Image className='border-black' src="/animation.gif" width={1000} height={1000} alt="samsara logo" />
          </div>

          {
            step == 0 && <div>
              <div className='text-center space-y-10 mb-10'>
                <h1 className='animate-text bg-gradient-to-r from-primary via-gray-200 to-primary-focus bg-clip-text text-transparent font-bold text-2xl lg:text-4xl'>Samsara - Say goodbye to Swiping</h1>
                <p className='font-semibold text-center text-white text-sm lg:text-base'>
                  Let me be your personal matchmaker. Combining scientific methods with traditional wisdom, I'll guide you towards meaningful connections.
                </p>
              </div>

              <div className='flex flex-col'>
                <Button text={'Request an invite'} onClick={() => moveToNextSection()} />

              </div>
            </div>
          }
        </div>

        <div className={`flex flex-col justify-center space-y-4 px-10 ${formOpacity ? "opacity-100" : "opacity-0"} transition-opacity ease-in duration-700 mx-auto px-10 lg:w-1/3`}>

          {/* First name and Last name */}
          {
            step == 1 && <div>
              {
                formOpacity && <h1 className="mb-1  font-semibold text-xl lg:text-4xl text-gray-100 md:text-6xl text-center">
                  Hi my name is <br className="block md:hidden" />
                  <span
                    className="inline-flex h-20 pt-2 overflow-x-hidden animate-type group-hover:animate-type-reverse whitespace-nowrap text-brand-accent will-change-transform"
                  >
                    Samsara 👋, What yours?
                  </span>
                  <span
                    className="box-border inline-block w-1 h-10 ml-2 -mb-2 bg-white md:-mb-4 md:h-16 animate-cursor will-change-transform"
                  ></span>
                </h1>
              }<p className='text-black font-semibold text-base text-center lg:text-xl '>While I have access to knowledge from thousands of years of understanding relationships, I'd like to get to know you better. May I know your age?
              </p>

              <div className='space-y-5 '>
                <label
                  htmlFor="firstName"
                  className="block overflow-hidden bg-gray-800 rounded-md border border-gray-800 px-3 py-2 shadow-sm focus-within:border-primary-focus focus-within:ring-1 focus-within:ring-primary-focus"
                >
                  <span className="text-xs font-medium text-gray-300 "> First name </span>

                  <input
                    type="name"
                    placeholder="First name"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 w-full border-none bg-gray-800 text-white p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                </label>
                <label
                  htmlFor="lastName"
                  className="block overflow-hidden bg-gray-800 rounded-md border border-gray-800 px-3 py-2 shadow-sm focus-within:border-primary-focus focus-within:ring-1 focus-within:ring-primary-focus"
                >
                  <span className="text-xs font-medium text-gray-300 "> Last name </span>

                  <input
                    type="name"
                    placeholder="Last name"
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 w-full border-none bg-gray-800 text-white p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                </label>
                {
                  errorMessage && <div className="animate-shake bg-red-700 rounded-lg py-3 px-4 mb-4 text-base text-gray-200 font-semibold" role="alert">
                    {errorMessage}
                  </div>
                }

                <Button text={'Confirm 1/3'} onClick={() => moveToNextSection()} />
              </div>

            </div>
          }


          {/* Date of birth */}
          {
            step == 2 && <div className='space-y-8'>
              <h1 className="mb-1  font-semibold text-xl lg:text-4xl text-gray-100 md:text-6xl text-center">
                Hi {firstName} <br className="block md:hidden" />
                <span
                  className="inline-flex h-20 pt-2 overflow-x-hidden animate-type group-hover:animate-type-reverse whitespace-nowrap text-brand-accent will-change-transform"
                >
                  Nice to meet you 👋
                </span>
                <span
                  className="box-border inline-block w-1 h-10 ml-2 -mb-2 bg-white md:-mb-4 md:h-16 animate-cursor will-change-transform"
                ></span>
              </h1>
              <p className='text-white font-semibold text-base text-center lg:text-xl '>While I have access to knowledge from thousands of years of understanding relationships, I'd like to get to know you better. May I know your age?
              </p>
              <div className='space-y-5'>
                <label
                  htmlFor="dateOfbirth"
                  className="block overflow-hidden bg-gray-800 rounded-md border border-gray-800 px-3 py-2 shadow-sm focus-within:border-primary-focus focus-within:ring-1 focus-within:ring-primary-focus"
                >
                  <span className="text-xs font-medium text-gray-300 "> Date of birth </span>

                  <input
                    onChange={(e) => setDateOfBirth(new Date(e.target.value))}
                    type="date"
                    placeholder="Date of birth"
                    className="mt-1 w-full border-none bg-gray-800 text-white p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                </label>

                {
                  errorMessage && <div className="animate-shake bg-red-700 rounded-lg py-3 px-4 mb-4 text-base text-gray-200 font-semibold" role="alert">
                    {errorMessage}
                  </div>
                }
                <Button text={'Confirm 2/3'} onClick={() => moveToNextSection()} />
              </div>

            </div>
          }

          {/* email */}
          {
            step == 3 && <div className='space-y-5'>
              <p className='text-white font-semibold text-base text-center lg:text-xl  animate-floating'>With my personalized and curated approach, finding true connection has never been easier

              </p>
              <div className='space-y-5'>
                <label
                  htmlFor="lastName"
                  className="block overflow-hidden bg-gray-800 rounded-md border border-gray-800 px-3 py-2 shadow-sm focus-within:border-primary-focus focus-within:ring-1 focus-within:ring-primary-focus"
                >
                  <span className="text-xs font-medium text-gray-300 "> Email </span>

                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    className="mt-1 w-full border-none bg-gray-800 text-white p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                </label>
                <div className="flex items-start mb-4">
                  <input checked={checked} onChange={e => setChecked(e.target.checked)} id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded" />
                  <label htmlFor="checkbox-1" className="text-sm ml-3 font-medium text-gray-100">I agree to the <a href="https://www.meetsamsara.com/terms-and-conditions" target="_blank" rel="noreferrer" className="text-primary-focus hover:underline">terms and conditions</a></label>
                </div>
                {
                  errorMessage && <div className="animate-shake bg-red-700 rounded-lg py-3 px-4 mb-4 text-base text-gray-200 font-semibold" role="alert">
                    {errorMessage}
                  </div>
                }
                <Button text={'Confirm 3/3'} onClick={() => moveToNextSection()} loading={loading} />
              </div>

            </div>
          }

          {
            step == 4 && <div>
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
              <div className='flex flex-col justify-center space-y-5 pb-10'>
                <p className='font-bold text-lg text-center lg:text-xl animate-text bg-gradient-to-r from-primary via-gray-200 to-primary-focus bg-clip-text text-transparent mb-5'>Congratulations!
                </p>

                <p className='font-semibold text-base text-center lg:text-xl bg-primary-focus bg-clip-text text-transparent'>Congratulations! I received your request and can't wait to help you find lasting connection. I'll be in touch soon to get started. In the meantime, feel free to learn about my unique matchmaking system.</p>

                <a href="https://meetsamsara.com" className='flex justify-center' target="_blank" rel="noreferrer"><Button text='Go to website' onClick={() => { }} /></a>

              </div>


              <a href="https://www.meetsamsara.com/privacy-policy" target="_blank" rel="noreferrer" className='flex justify-center font-semibold text-white text-center text-xs hover:text-primary cursor-pointer duration-300'>Privacy Policy</a>

            </div>
          }

        </div>




      </main>

    </>
  )
}
