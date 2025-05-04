import { ParticipantsEmail } from '@/components/email-template';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// get the Resend API key from the environment
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { to, from, subject, text, replyTo, eventUrl } = await request.json();
        console.log('to', to, from, 'from', subject, 'subject', text, 'text', replyTo, 'replyTo', eventUrl);
        const response = await resend.emails.send({
            reply_to: replyTo,
            from,
            to, // to is an array contains multiple email addresses
            subject,
            react: ParticipantsEmail({ content: text, eventUrl }),

        });

        return NextResponse.json({ response });
    } catch (error) {
        return NextResponse.json({ error: 'there is an error' }, { status: 500 });
    }
}

// export async function GET() {
//     try {
//         const response = await resend.emails.send({
//             from: 'Acme <onboarding@resend.dev>', // 这里填写事件创建者的email
//             reply_to: 'yp25@st-andrews.ac.uk',
//             to: ['joyyujiepeng@gmail.com'], // 这里填写接收者的email数组
//             subject: 'Hello from Next.js',
//             react: ParticipantsEmail({ subject: 'Hello from Next.js', content: 'This is a test email from Next.js' }),
//         });

//         return NextResponse.json({ response });
//     } catch (error) {
//         return NextResponse.json({ error: 'there is an error' });
//     }
// }


