"use client";

import { useEffect, useState } from "react";
import { imgUrl } from "@/lib/img";
import { parseBehold, type IgPost } from "@/lib/instagram";

/**
 * "Latest from the lake" cards. Renders the build-time list immediately, then (when a Behold feed URL
 * is configured) refreshes from Behold in the browser so new reels show up without a redeploy.
 */
export default function ReelRail({ initial, feedUrl, limit = 6 }: { initial: IgPost[]; feedUrl?: string; limit?: number }) {
  const [posts, setPosts] = useState(initial);

  useEffect(() => {
    if (!feedUrl) return;
    let on = true;
    fetch(feedUrl, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const fresh = json ? parseBehold(json, limit) : null;
        if (on && fresh?.length) setPosts(fresh);
      })
      .catch(() => {});
    return () => { on = false; };
  }, [feedUrl, limit]);

  return (
    <ul className="ig__rail">
      {posts.map((p) => (
        <li key={p.id}>
          <a href={p.href} target="_blank" rel="noreferrer" className="ig__card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgUrl(p.image, 384)} alt="" loading="lazy" width={360} height={640} />
            <span className="ig__cap">{p.caption}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
