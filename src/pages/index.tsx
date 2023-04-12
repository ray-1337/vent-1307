import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { FC, useState, useEffect } from "react";
import { ventContent, getVents } from "@/util/Vent";
import Style from "../styles/Vent.module.css";

const ventLimitArray: number = 50;

// https://paulie.dev/posts/2022/10/react-hydration-error-425-text-content-does-not-match-server-rendered-html/#hydration-safe-hook
const useHydrationSafeDate = (date: Date) => {
  const [safeDate, setSafeDate] = useState<string>();

  useEffect(() => {
    setSafeDate(new Date(date).toLocaleString("en-US", { hour12: false }));
  }, [date]);

  return safeDate;
};

const VentHome: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({vents}) => {
  const [displayVent, setDisplayVent] = useState<boolean>(false);

  useEffect(() => {
    if (!vents?.length) {
      return alert("Unable to retrieve memories. Try again later.");
    };

    document.title = "lost in the memories.";

    setDisplayVent(true);
  }, []);

  if (!vents?.length) {
    return <></>;
  };

  return (
    <div className={Style.vent}>
      {/* warning */}
      {/* <div className={Style.intro} ref={(evt) => introHead = evt}> */}
        {/* <div className={Style.intro_warning} ref={(evt) => introWarning = evt}> */}
          {/* <h1>Warning</h1> */}
          {/* <p>This page contains self-harm, suicide, and emotionally sensitive topic. Please be aware.</p> */}
        {/* </div> */}
      {/* </div> */}

      {/* list */}
      <div className={`${Style.vents} ${displayVent ? Style.VWplayed : ""}`}>
        {
          vents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((ctx, index) => {
            return (
              <div key={index} className={Style.vent_content} style={{ border: index == 0 ? "2px solid #363636" : undefined }}>
                <div className={Style.vent_value}>
                  <p>{ctx.message}</p>
                </div>

                {/* {ctx.images ? (<div className={Style.vent_img}> <img src={ctx.images}></img> </div>) : (<></>)} */}

                <div className={Style.vent_date}>
                  <p>{useHydrationSafeDate(new Date(ctx.date))}</p>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  )
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const vents = await getVents();
    return {props: {vents: (vents || []).slice(0, ventLimitArray)}}
  } catch (error) {
    console.error(error);
    return {props: {vents: [] as ventContent[]}};
  };
};

export default VentHome;