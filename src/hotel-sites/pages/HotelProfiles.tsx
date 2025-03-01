import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react';
import apiClient from '../../api/apiClient';
import config from '../../config.json';
import { checkLogin } from '../../services/authService';
import { getCurrentUser } from '../../services/userService';
interface profileFormState {
  name: string;
  lastname: string;
  email: string;
}

function HotelProfile() {
  const [userForm, setUserForm] = React.useState<profileFormState>({
    name: '',
    lastname: '',
    email: '',
  });
  const [popup, setpopup] = React.useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userID, setUserID] = useState<string>('');

  useEffect(() => {
    const checkAuth = async () => {
      const checkAuthRes = await checkLogin();
      if (checkAuthRes) {
        setIsLogin(true);
        getUserInfo();
      } else {
        setIsLogin(false);
      }
    };
    checkAuth();
    const getUserInfo = async () => {
      const userData: any = getCurrentUser();
      console.log(userData);
      const res = await apiClient(
        `${config.api_url.localHost}/User/${userData.userID}`,
        { method: 'GET' },
      );
      setUserID(userData.userID);
      const userRes = res?.data;
      console.log(userRes);
      setUserForm({
        name: userRes.name,
        lastname: userRes.surname,
        email: userRes.email,
      });
    };
  }, []);
  const changeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setUserForm({ ...userForm, [e.target.id]: e.target.value });
  };
  const handleSubmit = async () => {
    const body = {
      name: userForm.name,
      surname: userForm.lastname,
      email: userForm.email,
    };
    console.log(body);
    const res = await apiClient(`${config.api_url.localHost}/User/${userID}`, {
      method: 'PUT',
      data: body,
    });
    console.log(res.data);
    const userNewData = res?.data.user;
    setUserForm({
      name: userNewData.name,
      lastname: userNewData.surname,
      email: userNewData.email,
    });
    setpopup(false);
  };

  const openEditPopUp = () => {
    setpopup(!popup);
  };
  const closeEditPopUp = () => {
    setpopup(false);
  };
  return (
    <>
      <div className="pt-36">
        {popup ? (
          <div className="block w-screen">
            <div className=" mx-auto border-2 border-black-900 w-2/3 rounded-lg md:px-16 sm:px-12 px-10 py-10  ">
              <div className="flex  justify-between w-auto ">
                <p className=" md:text-2xl sm:text-sm text-sm">Edit Profile</p>
                <div className="flex">
                  <svg
                    onClick={closeEditPopUp}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <div className="border-b-2 border-black-900 pb-4 mt-2 md-2"></div>
              <form className="pt-4">
                <fieldset className="field-area pt-3">
                  <label htmlFor="name" className="mr-3">
                    Name :
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="border-2 border-black-900 rounded-lg indent-2"
                    placeholder={userForm.name}
                    onChange={changeHandler}
                  />
                </fieldset>
                <fieldset className="field-area pt-3">
                  <label className="mr-2">Lname :</label>
                  <input
                    type="text"
                    id="lastname"
                    className="border-2 border-black-900 rounded-lg indent-2"
                    placeholder={userForm.lastname}
                    onChange={changeHandler}
                  />
                </fieldset>
                <fieldset className="field-area pt-3">
                  <label htmlFor="name" className="mr-4">
                    Email :
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="border-2 border-black-900 rounded-lg indent-2"
                    placeholder={userForm.email}
                    onChange={changeHandler}
                  />
                </fieldset>
                <div className="flex  justify-end w-auto ">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 md:py-1 mt-2 text-base md:text-sm rounded-full"
                    onClick={handleSubmit}
                  >
                    ยืนยัน
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : isLogin ? (
          <div className="block w-screen ">
            <div className="md:hidden">
              <img
                src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/67abf060-d47c-4593-9655-19533a29e467/dew31gr-65edb5db-42ad-4c1d-af4f-637aa7d555f8.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY3YWJmMDYwLWQ0N2MtNDU5My05NjU1LTE5NTMzYTI5ZTQ2N1wvZGV3MzFnci02NWVkYjVkYi00MmFkLTRjMWQtYWY0Zi02MzdhYTdkNTU1ZjgucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.GyaK76NJ2JwRCx017QDOfMD3WdZhmxEqr9bijyidgHM"
                className="rounded-full h-56 mx-auto mb-6"
              />
              <div className=" rounded-lg my-4 mx-auto bg-slate-300 md:w-32 sm:w-16 w-2/5 ">
                <div className="text-center md:text-base sm:text-sm text-lg">
                  ผู้ให้บริการห้องพัก
                </div>
              </div>
            </div>
            <div className=" mx-auto border-2 border-black-900 w-2/3 rounded-lg md:px-16 sm:px-12 px-10 py-10  ">
              <div className="flex  justify-between w-auto ">
                <p className=" md:text-2xl sm:text-lg text-lg">My Profile</p>
                <div className="flex pt-2 md:pt-3">
                  <svg
                    onClick={openEditPopUp}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>

                  <p onClick={openEditPopUp} className="text-sm cursor-pointer">
                    edit
                  </p>
                </div>
              </div>
              <div className="border-b-2 border-black-900 pb-4 mt-1 md:mt-2 md-2 "></div>
              <div className="flex mt-4 ">
                <div className="mr-6 sm:mr-8 hidden md:block">
                  <img
                    src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/67abf060-d47c-4593-9655-19533a29e467/dew31gr-65edb5db-42ad-4c1d-af4f-637aa7d555f8.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY3YWJmMDYwLWQ0N2MtNDU5My05NjU1LTE5NTMzYTI5ZTQ2N1wvZGV3MzFnci02NWVkYjVkYi00MmFkLTRjMWQtYWY0Zi02MzdhYTdkNTU1ZjgucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.GyaK76NJ2JwRCx017QDOfMD3WdZhmxEqr9bijyidgHM"
                    className="rounded-full md:h-40 sm:h-18 h-18 "
                  />
                  <div className=" rounded-lg my-4 mx-auto bg-slate-300 md:w-32 sm:w-16 w-16 ">
                    <div className="text-center md:text-base sm:text-sm text-sm">
                      ผู้ให้บริการห้องพัก
                    </div>
                  </div>
                </div>
                <div className="mt-6 pl-12">
                  <p className="mb-4 text-lg text-ellipsis overflow-hidden">
                    ชื่อ : {userForm.name}
                  </p>
                  <p className="mb-4 text-lg text-ellipsis overflow-hidden">
                    นามสกุล : {userForm.lastname}
                  </p>
                  <p className="mb-4 text-md text-ellipsis overflow-hidden">
                    Email : {userForm.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xl">Please Login First!</div>
        )}
      </div>
    </>
  );
}

export default HotelProfile;
