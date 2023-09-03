import React from "react";

const DummyPage = () => {
 
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <span className="text-xl font-semibold mb-14">Hello Codeate Team</span>
        <form action="https://oauthapp-8l6w.onrender.com/logout" method="post">
							<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" type="submit">Sign out</button>
				</form>
      </div>
    </div>
  );
};

export default DummyPage;
