import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
import EmailProvider from "next-auth/providers/email";
import nodemailer, { createTransport } from "nodemailer";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        EmailProvider({
            server: {
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            async sendVerificationRequest(params) {
                const { identifier, url, provider, theme } = params;
                const { host } = new URL(url);

                const transport = createTransport(provider.server);

                const result = await transport.sendMail({
                    to: identifier,
                    from: provider.from,
                    text: text({ url, host }),
                    html: html({ url, host, theme }),
                });

                const failed = result.rejected.concat(result.pending).filter(Boolean);

                if (failed.length) {
                    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
                }
            }
        }),
    ],
    session: {
        strategy: "database",
    },
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        }
    }
};

function html(params: { url: string; host: string; theme: any }) {
    const { url, host, theme } = params;

    const escapedHost = host.replace(/\./g, "&#8203;.");

    const brandColor = "#8b5cf6"; // Violet-500

    const color = {
        background: "#0f172a",
        text: "#f8fafc",
        mainBackground: "#1e293b",
        buttonBackground: brandColor,
        buttonBorder: brandColor,
        buttonText: "#ffffff",
    };

    return `
    <body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.background}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        <strong>QuickVote</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
    
        `;
}

function text({ url, host }: { url: string, host: string }) {
    return `Sign in to ${host}\n${url}\n\n`;
}