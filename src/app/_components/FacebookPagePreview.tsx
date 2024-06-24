"use client"
import React from "react";

type Props = {
    children?: React.ReactNode
}

const FacebookPagePreview = (props: Props) => {
    return <iframe
        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fatinwps&tabs&width=340&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=324223506516047"
        width="340" height="auto"
        style={{
            border: 'none',
            overflow: 'hidden'
        }}
        scrolling="no" frameBorder="0"
        allowFullScreen={true}
        className="mx-auto"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>

}

export default FacebookPagePreview;