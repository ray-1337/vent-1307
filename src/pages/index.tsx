import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { FC, useState, useEffect } from "react";
import { ventContent, getVents } from "@/util/Vent";
import Style from "../styles/Vent.module.css";
import { sanitize } from "isomorphic-dompurify";
import { marked } from "marked";

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
      alert("Unable to retrieve memories. Try again later.");
      document.title = "i don't think it'll work this time.";
      return;
    };

    document.title = "five seconds flat.";

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
              <div key={index} data-id={ctx?.ventID || undefined} className={`${Style.vent_content} ${index == 0 ? Style.selfish : ""}`}>
                <div className={Style.vent_value} dangerouslySetInnerHTML={{__html: ctx.message}} ></div>

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
    if (vents?.length) {
      vents.forEach((_, index) => {
        vents[index].message = sanitize(marked.parseInline(vents[index].message, { gfm: true, breaks: true }))
      });
    };
    return {props: {
      vents: (vents || [])
      .filter(message => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(message.date) >= oneWeekAgo;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }}
  } catch (error) {
    console.error(error);
    return {props: {vents: [] as ventContent[]}};
  };
};

export default VentHome;