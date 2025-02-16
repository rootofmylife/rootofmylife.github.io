# Project Management

## Why I do here?

To start my own business

## Scoping

To scope a project accurately, you need to pay attention throughout the project during:

1. The planning phase: the early stages of defining the project and its goals
2. The scoping phase: the time when most people think about scoping. This is where you try to list out the work that needs to be done given the project goals, and estimate how much time will be required to do them.
3. The execution phase: when you are actually implementing the project.

### The planning phase

One of the most important things to do during this time is to **define very specific goals for the project**. For example, instead of “improve X to be more scalable and performant,” a better and more specific goal might be to “improve X by adding unit tests, supporting 20K queries per second, and reducing capped mean of user latency to <= 200ms.”

Having very specific goals allows you to ruthlessly cut anything that does not contribute to these goals, so that you don’t suffer from [feature creep](https://en.wikipedia.org/wiki/Feature_creep). Along these lines, you might also consider explicitly defining **anti-goals**, and separating **must-haves** and **nice-to-haves**.

**Minimize the batch size of the project** by (1) setting up clear milestones and checkpoints for the project, and (2) making it easy to launch only part of the project. Not only does this help break down the project, but it will also allow the team to pause or cut the project early if another, higher priority task comes up.

**De-risk the project as soon as possible**. Two common ways of de-risking a project include (1) working on the riskiest parts upfront, and (2) prototyping the riskiest parts using dummy data and/or scaffolding. Whenever a new open-source system or external service is used, that usually represents a big risk.

Don’t optimize for total amount of work done. Instead, **optimize for total amount of impact over time**. Once you’ve gotten the riskiest part out of the way, prioritize working on the part of the project that would result in the highest amount of impact immediately.

Here’s one way to think about this: plot the impact of a project over time, where the Y axis is impact, and the X axis is time. At the start of the project, the impact is 0%, and at the end of the project, the impact is 100%. You want to maximize the area under the curve by doing high ROI tasks first.

Try to **avoid rewriting big systems from scratch as much as possible**. When doing a rewrite, we tend to (1) underestimate how much work it would be, (2) be tempted to add new features and improvements, and (3) build an overly complicated system because we are too focused on all the shortcomings of the first system.

Instead of doing a big rewrite, consider incrementally replacing subsystems. Have good abstraction layers that support swapping out one part of the old system at a time, so you don’t need to wait for everything to be done to test the new system.

### The scoping phase

- Only the **engineers writing the code should be the ones scoping** the tasks. Not their managers, not the PM, or the key stakeholders in the company.
- **Resist the temptation to under-scope**. Be honest about how long tasks will take, not how long you or someone else (such as your manager or the Go To Market team) wants them to take.
- **Divide the project into small tasks, each taking two days or less**. When you have tasks that are scoped to “**roughly 1 week,**” they often end up taking longer because you didn’t enumerate all the subtasks that you might need to do.
- Define **measurable milestones** to get to the project goal. Schedule each with a specific calendar date representing when you expect this milestone to be reached. Then, establish some sort of external accountability on these milestones by, for example, committing them to your manager and setting up milestone checkins.
- ==**Think of project time estimates as probability distributions**==, not best-case scenarios. Instead of telling someone that a feature will be finished in 6 weeks, tell them something like “there’s a 50% likelihood of finishing the feature in 4 weeks, and a 90% chance we’d finish it in 8 weeks.” This tends to force people to be more realistic.
- **Add** **buffer** to account for: (1) Dev time != calendar time, due to meetings, interviews, and holidays. I usually multiply the dev time by 1.5 to get to the calendar time. (2) Unexpected project tasks time, since there are always tasks that you didn’t realize you need to do until much later, such as refactoring old code, debugging seemingly unexplainable behaviors, adding tests. The more experienced you are at scoping, the smaller this multiplier would get.
- **Use historical data.** Keep track of whether you’ve tended to overscope or underscope projects in the past (most people tend to underscope). Adjust your scoping accordingly.
- Keep in mind that **2X the number of people does not mean 1/2X the dev time**, as a result of communication overheads, ramp up time, etc.
- Consider **timeboxing open-ended parts of the project**. Instead of “find the best stream processing framework for this system,” which can take months of research and prototyping, timebox it to “find a suitable streaming processing framework in a week.” Use your judgement here to balance this against incurring long term operational overhead.

### The execution phase

**Re-scope regularly** during the project execution. For each task, track how much time you estimated the task would take, then how long it actually took you to complete it. Do this for every measurable milestone. If your scoping is off by 50% for the first parts of the project, odds are your scoping will also be off by 50% for the rest of the project.

**Use milestones to answer “how’s the project going?”** As engineers, it’s tempting to answer “it’ll be done by next week” or “until end of this month.” But these types of vague answers tend to create projects that are _always_ 2 weeks away from being finished. Instead, use the (re-scoped) milestones to give a concrete answer based on how much work is left.

If the project slips, make sure everyone understands why the project has slipped. Then, **develop a realistic and revised version of the project plan**. Dropping the project or cutting it short is a potential option that should be considered. Read more about [The Sunk Cost Fallacy](https://youarenotsosmart.com/2011/03/25/the-sunk-cost-fallacy/) if you are curious why people tend to bias against cutting a project half way.

## Name your business

Dopticaq
**Treesdoo**.

- Shopify - [ShopMarch](https://honey-hole-6ed.notion.site/SM-Landing-Page-5251b3bd2d8946d6857fd0b5e598940c?pvs=74)

- Weekly check with customer segment with ShopMarch [Customer Segment](https://docs.google.com/spreadsheets/d/11xNnLQ9Nh65ueqXj12NGgQy-qQKAKAOmPzFQWbVMcgQ/edit?gid=0#gid=0) - Write blog for ShopMarch

ShopMarch = Shopify + March

Brand Overview:

- Brief introduction to the brand's mission, values, and purpose.
- Explanation of the brand's positioning and unique selling points.
  Mission, Vision, and Values:
- Clearly articulated mission statement, vision statement, and core values.
- How these elements should be communicated across various platforms.
  Logo Usage and Variations:
- Clear specifications for logo usage, including size, spacing, and minimum dimensions.
- Variations of the logo (colour, black and white, grayscale) for different contexts.
- Prohibited logo alterations and misuses.
- Minimum clear space required around the logo to maintain visual integrity.
  Colour Palette:
- Defined primary and secondary colour palette with colour codes (CMYK, RGB, HEX).
- Examples of colour usage in various contexts (web, print, merchandise).
  Typography:
- Typography choices for headings, subheadings, body text, etc., including font names and weights.
- Guidelines for font size, line spacing, and text alignment.
  Visual Elements, Photography and Imagery:
- Guidelines for imagery, photography style, and use of graphics.
- Guidelines for selecting and using images that align with the brand's image.
- Preferred image styles and content themes.
  Tone of Voice and Writing Style:
- Description of the brand's tone, voice, and writing style, as discussed earlier.
- Examples of appropriate language and messaging for different channels.
  Iconography and Graphics:
- If applicable, guidelines for the use of icons and graphical elements.
- Explanation of the meaning behind specific icons if they hold significance.
  Stationery Design:
- Layouts and templates for business cards, letterheads, envelopes, etc.
- Proper placement of logo, contact information, and other elements.
  Brand Applications:
- Application examples across different mediums, such as business cards, stationery, social media profiles, website, signage, etc.
  Digital Guidelines:
- Social Post templates/how display our brand digitally
- Hashtags - Primary & Secondary (#FirstAidPro; #KnowledgeSavesLives)
- Recommendations for email signatures and digital presentations.
  Brand Collateral and Merchandise:
- Design templates for branded materials such as brochures, flyers, banners, and merchandise.
  Usage Examples:
- Real-world examples of correct and incorrect brand applications.
  Legal Considerations:
- Copyright and trademark information related to the brand assets.
- Any specific legal disclaimers or notices that need to be included.
  Contact Information:
- Details of the person or department responsible for brand management and compliance.

```firebase-secret
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKNFHOgokOByH5G0iyvI5ELRrPBpT9B-k",
  authDomain: "treesdoo-6ef8a.firebaseapp.com",
  projectId: "treesdoo-6ef8a",
  storageBucket: "treesdoo-6ef8a.appspot.com",
  messagingSenderId: "732799611430",
  appId: "1:732799611430:web:d43605a77d7c04cd8aece7",
  measurementId: "G-N0NJ6S8Q5P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

## Customer Segment

### Who is our audience?

Requirements to be your target customer:

1. Business Alignment: Prioritize groups directly contributing to key metrics such as revenue, market share, or strategic growth areas.
2. User Impact: Groups whose needs, if met, would significantly enhance overall user satisfaction and engagement should be prioritized.
3. Needs: Prioritize user groups with the most acute pain points, especially if these are barriers to project goals.
4. Growth potential: Larger or rapidly growing segments may offer more value in the long term, justifying their prioritization.
5. Regulatory requirements: Legal and regulatory requirements might influence which user groups need to be prioritized.

Do some customer interview to get insights, and the interview must:

- Identify topics and starter questions: Identify the topics you wish to discuss and have some questions, but try to remain flexible.
- Build Rapport: Begin your interviews with light, non-threatening questions to make participants feel comfortable.
- Listen more, talk less: Encourage participants to do most of the talking, and resist the urge to fill silences with your thoughts or leading questions.
- Ask follow-up questions: Probe deeper into interesting or unexpected answers with follow-up questions. Ask why a lot!

Or use Pollish, Lookback to do the survey

### What is their needs?

## Content Marketing/Strategy

## Branding

## Customer Journey Map

## Persona

## Empathy Map

## Landing Page

### Header

- Logo
- Menu:
  - Home
  - Services
  - Shopify Store Setup <-
  - Theme Customization <-
  - App Integration???
  - SEO <-
  - Blogs
  - Projects
  - About Us
  - Contact
  - CTA Button: 'Get Free Consultant'

### Main Banner (Hero Section)

- Title: Transform Your Business with Expert Shopify Web Development
- Description: - New to Shopify? Switching platforms? - Or ready to take your store from zero to hero? - Our Shopify development ninjas are here to unlock your online potential. - At our company, we're obsessed with crafting winning Shopify experiences, and your success is our guarantee.
   - Call-to-action (CTA) button: Launch Your Shopify Now

### Service Section

- Overview:
  - Unleash the Power of Shopify with Our Expert Design and Development
  - At our company, we specialize in creating visually stunning, highly functional, and user-friendly Shopify stores tailored to meet your unique business needs.
  - Our comprehensive Shopify web design services cover everything from initial concept and design to development and launch.
  - We focus on delivering a seamless shopping experience for your customers, enhancing your brand’s online presence, and driving sales.
  - Our expert team ensures your store is optimized for performance, mobile responsiveness, and SEO, providing you with a robust platform to grow your eCommerce business.
- Key benefit:
  - Why Shopify is the Perfect Platform for Your Business?
  - Shopify is more than just an e-commerce platform; it's a powerful tool designed to empower businesses of all sizes. Here are just a few key benefits of choosing Shopify for your online store:
    - **Easy to Use:** Shopify's user-friendly interface makes it simple to manage your products, inventory, and orders, even with limited technical knowledge.
    - **Scalability:** As your business grows, Shopify seamlessly scales with you, allowing you to add features and functionality to meet your evolving needs.
    - **Security and Reliability:** Shopify is a secure and reliable platform that takes care of the technical aspects, allowing you to focus on running your business.
    - **Wide Range of Apps and Integrations:** Extend your store's functionality with thousands of apps and integrations available in the Shopify App Store.
    - **Cost-Effective:** Shopify offers a variety of subscription plans to fit your budget, making it an attractive option for businesses of all sizes.
    - **(6th benefit)**

### Service Packages Section

**Basic Package**: Ideal for small businesses or startups looking to establish their online presence.
**Pro Package**: Perfect for growing businesses needing more advanced features and multi-channel selling capabilities.
**Enterprise Package**: Tailored for large businesses or those with complex e-commerce needs, offering maximum customization and support.

| Features                      | Basic Package | Pro Package           | Enterprise Package    |
| ----------------------------- | ------------- | --------------------- | --------------------- |
| Custom Design & Branding      | ✅            | ✅                    | ✅                    |
| E-commerce Optimization       | ✅            | ✅                    | ✅                    |
| Performance Tuning            | Basic         | Advanced              | Premium               |
| SEO & Marketing Tools         | Basic         | Advanced              | Premium               |
| Security & Compliance         | ✅            | ✅                    | ✅                    |
| Scalable Architecture         | ❌            | ✅                    | ✅                    |
| Multi-channel Selling         | ❌            | Up to 2 channels      | Unlimited             |
| Advanced Analytics            | Basic         | Advanced              | Premium               |
| Inventory Management          | Basic         | Advanced              | Premium               |
| Payment Gateway Integration   | Up to 2       | Up to 5               | Unlimited             |
| Customer Account Management   | ✅            | ✅                    | ✅                    |
| Order Management              | Basic         | Advanced              | Premium               |
| Product Customization         | ❌            | Basic                 | Advanced              |
| App Integration               | Up to 3 apps  | Up to 10 apps         | Unlimited             |
| Ongoing Support & Maintenance | Email Support | Email & Phone Support | 24/7 Priority Support |
| Custom App Development        | ❌            | ❌                    | ✅                    |
| Price (one-time setup fee)    | $1.000        | $2.000                | $8.000                |
| Monthly Maintenance           | $250/month    | $500/month            | $1.000/month          |

Or you want to hire me?

### Workflow Section

Our Shopify store development implementation process (TODO: need to shorten the description):
Discovery and Planning:
This is the first step where we get to know your business and your goals. We discuss your brand, target audience, competitors, and specific requirements for your Shopify store. The aim is to understand your vision and set clear objectives for the project.

Design Conceptualization:
In this step, we translate your vision into visual concepts. We start with wireframes to outline the layout and structure of your store, followed by detailed mockups of key pages. After reviewing and refining the designs with your feedback, we finalize the design, ensuring it aligns with your brand identity.

Core Functionality Setup:
This is where the actual building of your Shopify store happens. We set up the Shopify platform, configure settings, and develop a custom theme based on the approved designs. We also integrate necessary apps, implement SEO best practices, and develop any custom features required for your store.

Content Integration:
We populate your store with the content you provide. This includes adding product listings, descriptions, images, and prices, as well as setting up collections and categories. We also create and format content for static pages like About Us and Contact, ensuring all content is SEO optimized.

Testing and Quality Assurance:
We thoroughly test the website to ensure it functions correctly across different browsers and devices. This includes user testing to identify any issues, testing all functionalities like forms and payment gateways, and optimizing site speed and performance. Any bugs or issues identified are addressed and resolved.

Client Review
We present the fully developed website to you for review. This is your opportunity to provide feedback and request any final adjustments. We make the necessary revisions to ensure the final product meets your expectations and is ready for launch.

Launch Preparation and Go-Live:
We perform a final review and quality check before launching the website. This includes configuring domain settings and making the site live. We monitor the website post-launch to ensure everything is functioning smoothly and address any immediate issues.

Post-Launch Support and Optimization:
After the launch, we provide continuous support to ensure your store remains functional and up-to-date. This includes regular updates, troubleshooting, and assistance with future enhancements. We also offer training and documentation to help your team manage the store effectively.

### Outstanding Features/Services

**Custom-Tailored Design & Functionality:**

- We go beyond basic themes, creating a unique and visually appealing website that reflects your brand identity.
- We develop custom functionalities to match your specific business needs, ensuring a seamless user experience for your customers.

**SEO Optimization for Maximum Visibility:**

- We optimize your product listings and website content to rank higher in search engine results pages (SERPs).
- This increases organic traffic to your store and helps you attract more potential customers.

**Mobile-Responsive Design for All Devices:**

- We ensure your website displays flawlessly across desktops, tablets, and smartphones.
- This caters to today's mobile-first browsing habits and guarantees a positive user experience for all your visitors.

**Secure Payment Gateways for Customer Trust:**

- We integrate secure payment gateways, allowing your customers to make safe and convenient purchases on your store.
- This builds trust and encourages them to complete their transactions with confidence.

**Ongoing Support & Maintenance:**

- We don't just build your website, we support you every step of the way.
- Our ongoing support ensures your store stays up-to-date, functions smoothly, and adapts to your growing business needs.

### Typical Projects

Display completed projects
Case studies (if any)

**LuxeLeather Co**.

- Project: High-end leather goods e-commerce store
- Features: Custom product configurator, AR product viewer
- Results: 150% increase in average order value, 40% reduction in return rate
  Case Study: We developed a bespoke Shopify Plus store for LuxeLeather, featuring a unique product customization tool that allows customers to design their own leather bags. The integration of AR technology for product visualization led to higher customer satisfaction and fewer returns.

GreenGrove Organics

- Project: Organic food subscription service
- Features: Recurring billing system, customizable subscription boxes
- Results: 200% growth in subscriber base within 6 months
  Case Study: Our team created a user-friendly subscription management system, allowing customers to easily customize their organic produce boxes. The streamlined checkout process and engaging product presentation contributed to rapid subscriber growth.

TechTrend Electronics

- Project: Multi-vendor electronics marketplace
- Features: Vendor management system, advanced filtering options
- Results: 80% increase in product range, 60% boost in overall sales
  Case Study: We transformed TechTrend's single-vendor store into a thriving multi-vendor marketplace. The implementation of an intuitive vendor portal and sophisticated product search functionality significantly expanded their offering and improved user experience.

### Customer Reviews

Feedback from customers who have used the service

### Reason to choose our service

Founded in 2022

- As a young company, we bring innovative ideas and the latest trends to Shopify development. Our fresh approach helps your store stand out.
  Rapid Growth 50+ Stores
- We've helped over 50 businesses go online in just 12 months. Our quick growth shows we know how to get results fast.
  30% Average Revenue Increase for Clients
- On average, our clients see a 30% boost in revenue after launching their new Shopify stores. Your success is our success.
  Tech-Savvy Team
- Our compact team of 10 Shopify-certified developers ensures personalized attention and cutting-edge solutions for every project.
  Quick Turnaround 3-Week
- We get your store up and running in about 3 weeks. Quick launches mean you start selling sooner.
  Affordable Packages
- We offer budget-friendly options perfect for new businesses, without compromising on quality or features.

### FAQ (Frequently Asked Questions)

**Q: Why should I choose Shopify for my online store over other platforms?**
**A:** Shopify offers an intuitive interface, scalability, and a robust ecosystem of apps. It's ideal for businesses looking to quickly launch and manage an eCommerce store with minimal technical expertise.

**Q: Can you customize the design of my Shopify store to match my brand?**
**A:** Yes, we provide custom theme design services to ensure your Shopify store reflects your brand identity and offers a unique user experience tailored to your target audience.

**Q: How long does it take to build a Shopify website?**
**A:** The timeline varies based on the project complexity and client requirements. Typically, it ranges from a few weeks to a couple of months from start to launch.

**Q: Do I need to purchase a domain and hosting separately for my Shopify store?**
**A:** No, Shopify provides hosting as part of its service, and you can purchase a domain directly through Shopify or use your existing domain.

**Q: Can you migrate my existing website to Shopify?**
**A:** Yes, we offer migration services to transfer your website from other platforms to Shopify, ensuring a smooth transition while preserving SEO rankings and data integrity.

**Q: Can you integrate third-party apps and tools with my Shopify store?**
**A:** Yes, we integrate essential and custom third-party apps to extend your store's functionality, including marketing tools, inventory management systems, and more tailored solutions as needed.

**Q: How do I get started with your Shopify web building service?**
**A:** Simply contact us to schedule an initial consultation. We'll discuss your project requirements, goals, and provide you with a detailed proposal outlining our approach, timeline, and pricing. We're here to help you build a successful Shopify store from start to finish!

### Blogs/Resources

**Title:** **Shopify for Beginners: A Step-by-Step Guide to Launching Your Online Store**
**Description:** Feeling overwhelmed by starting an online business? This guide breaks down everything you need to know about Shopify, from setting up your store to adding products and making your first sale.

**Title:** **Unlocking Your Shopify Store's Potential: 5 Must-Have Features to Boost Sales**
**Description:** Want to take your Shopify store to the next level? Discover 5 essential features that can increase conversions, improve customer experience, and boost your online sales.

**Title:** **The Mobile-First Mindset: Why Your Shopify Store Needs to be Responsive**
**Description:** In today's mobile-driven world, a responsive website is crucial. Learn why a mobile-friendly Shopify store is essential for reaching more customers and maximizing your online sales potential.

**Title:** **Design Inspiration: Showcase of Stunning Shopify Stores Across Industries**
**Description:** Feeling stuck for design inspiration? Explore our curated list of stunning Shopify stores from various industries. Get inspired by successful examples and discover design trends to elevate your own store.

### Call-to-action (CTA)

Contact form or button to request a quote

Grow Your Sales with a High-Converting Shopify Store.
Get a Free Quote! (Button)

### About Us

[Giới thiệu toàn cảnh]

Dưới sự bùng nổ của internet, rất nhiều trang web được doanh nghiệp xây dựng nên để giới thiệu sản phẩm của mình đến gần hơn với khách hàng từ đó tăng doanh thu và thu hút thêm các tệp khách hàng mới. Thuật ngữ SEO (Search Engine Optimization) ra đời nhằm tối ưu hóa công cụ tìm kiếm, giúp lượng truy cập website của doanh nghiệp tăng lên đáng kể.

[Giới thiệu vấn đề]

Tuy nhiên trong bối cảnh công nghệ phát triển nhanh chóng như hiện nay, rất nhiều các doanh nghiệp nhỏ và hộ kinh doanh vẫn chưa có đầy đủ kiến thức về việc xây dựng website và tối ưu hóa công cụ tìm kiếm, hoặc đã có website nhưng hoạt động không hiệu quả, lo sợ chi phí duy trì đắt đỏ. Nhận thức được vấn đề trên, March Studio ra đời nhằm giúp các doanh nghiệp nhỏ và các hộ kinh doanh trong việc đến gần hơn với khách hàng bằng cách cung cấp các dịch vụ tối ưu với chi phí phải chăng.

Chèn link dịch vụ + bảng giá text “Dịch vụ của chúng tôi”

Không chỉ vậy chúng tôi luôn sẵn sàng đồng hành cùng khách hàng trong quá trình xây dựng và duy trì website, lấy khách hàng làm trọng tâm và đem đến cho khách hàng những trải nghiệm xuất sắc nhất.

[Thành tựu]

Kể từ khi March studio được thành lập, chúng tôi đã giúp 50+ doanh nghiệp xây dựng website của riêng mình, từ đó tăng thêm 30% doanh thu. Ngoài ra, thời gian xây dựng và đưa website chính thức vận hành chỉ trong 3 tuần, giúp doanh nghiệp nhanh chóng trở lại đường đua và tiếp cận được nhiều khách hàng hơn.

[Bức tranh tương lại]

Trong tương lai, March Studio sẽ tiếp cận và hỗ trợ thêm nhiều các khách hàng khác, hỗ trợ khách hàng trên con đường phát triển doanh nghiệp. Đây sẽ là hành trình không hề ngăn nhưng March Studio tin với đội ngũ phát triển hiện tại, chúng tôi có thể đi xa hơn nữa, đồng hành cùng nhiều khách hàng hơn nữa trong tương lai.

### Footer

**Headline:** Contact Us

- **Phone:** +1234567890
- **Email:** info(at)yourcompany.com
- **Address:** [Your Company Address, City, State, Zip Code]

**Headline:** Connect with Us:

- Facebook
- Twitter
- LinkedIn
- Instagram

**Headline:** Explore Our Services

- Home
- Services
- Projects
- About Us
- Contact Us

**Headline:** Legal Information

- Privacy Policy
- Terms & Conditions

### Privacy Policy

At our company, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you visit our website or use our Shopify website building services.
1.     **Information We Collect:**

- We may collect personal information such as your name, email address, phone number, and company details when you contact us or use our services.

  2.     **How We Use Your Information:**

- Your information is used to provide and personalize our services, communicate with you, process payments, and improve our offerings.

  3.     **Data Security:**

- We implement industry-standard security measures to protect your personal information from unauthorized access, misuse, or disclosure.

  4.     **Sharing of Information:**

- We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or to fulfill your service requests.

  5.     **Your Choices:**

- You have the right to access, update, or delete your personal information. You can also opt-out of receiving marketing communications from us.

  6.     **Changes to This Policy:**

- We may update this Privacy Policy periodically to reflect changes in our practices. We will notify you of any significant changes by posting the revised policy on our website.

For more detailed information about our Privacy Policy, please contact us at email abc(at)gmail.com or refer to the full policy on our website.

### Terms of Use

Welcome to our company. By accessing our website and using our Shopify website building services, you agree to comply with these Terms of Use.
1.     **Use of Our Services:**

- You agree to use our services solely for lawful purposes and in accordance with any applicable laws and regulations.

  2.     **Intellectual Property:**

- All content, logos, and trademarks displayed on our website are the property of our company or their respective owners. You may not use or reproduce them without permission.

  3.     **Limitation of Liability:**

- We strive to provide accurate and up-to-date information, but we do not guarantee the completeness or reliability of the content on our website. Your use of our services is at your own risk.

  4.     **Third-Party Links:**

- Our website may contain links to third-party websites or services that are not owned or controlled by [Your Company Name]. We are not responsible for the content or practices of these websites.

  5.     **Changes to Terms:**

- We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting on our website. Continued use of our services constitutes acceptance of the revised terms.

  6.     **Governing Law:**

- These Terms of Use are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].

If you have any questions about our Terms of Use, please contact us at abc(at)gmail.com or refer to the full terms on our website.

## Prototype

## Prototype Testing

Purposes:

- Accessibility: Test with screen readers, keyboard navigation, and other assistive technologies.
- Content Comprehensibility: Is the text content easy to read and understand?
- Conversion Paths: Identify any drop-off points or barriers to conversion.
- Ease of Use: How easily can users navigate and understand the prototype?
- Navigation: Is the prototype easy to navigate? Are the navigation elements logically and consistently placed?
- Learnability: How fast can new users learn the prototype? Any confusing features?
- Efficiency: How efficiently can users complete tasks?
- Satisfaction: How likely are users to use the prototype as a real product?
- Interactivity: Test interactive elements for functionality, user-friendliness, and error handling.

### Usability Testing

Around 6 people will get 95% problems in your apps
Interview user **directly** to guide them through a series of tasks, questioning them along the way

Cost: must hire someone to do this for you
Tool: recording

### Remote Interview Testing

Use Lookback to interview online

### Post launch Testing

## Sampling and Case Selection

A certain number of products, orders, individuals, groups, incidents or whatever UA has been chosen should be compared and analysed => sampling

Sampling ivolves decisions about how to select cases and about the number of cases to be selected.

Sampling presupposes a population. A population consists of all the objects about which new insight has to be gained. Three basic approaches exist:

1. **selecting a complete population**: when population is small or when data can be collected relatively easily
2. **random sampling**: aim to reach conclusions about a population by statistical generalization from a sample (must know the relevant variables and relationships that have to be tested)
   1. Simple random sampling: selecting cases randomly from a population, so that each case in th population has the same chance of being included
   2. Stratified random sampling: selecting cases from subsets of a population, so that all subsets of this population are represented
3. **purposeful sampling**: select cases that are informative for the purpose of the inquiry
   1. Single case
      1. Typical case: selecting one or more cases that are typical examples of the cases in a population
      2. Extreme case: selecting one or more cases that show extreme or unusual properties
      3. Influential case: selecting one or more cases that are or have been important for the organization
   2. Multiple case
      1. Homogeneous sampling: selecting cases that are similar in many ways
      2. Most similar cases (polar types): select cases that are similar in many ways, but differ sharply on a focal properties
      3. Most different cases: select cases that differ in all respects, except for similarity on a focal property
      4. Maximum variation: select cases so that these cases show variation on multiple dimensions

Number of cases to be selected:

- Saturation: an analysis is saturated when the analysis of additional cases provides no new insights. Saturation may be achieved after 3 cases nut may take 20 cases. Hard to predict how many cases it will take to achieve saturation
- The selection of new cases should be based on the results of cases that have already been executed
- Pragmatic considerations may require a decision on the number of cases in advance

## Complexity Project Management

Some complexity that you would like to know:

- Data state in the system: Understand that how each component react to state of other components
- Code volume: How big is your code volume?
- Flow control: The logic behind your code is too hard to understand?

After you write your code, think about this:

- Can you reuse your code?
- Can you test your code?
  - It is impossible to write good test for bad code

For example, we have a entity object

```javascript
interface BaseEntity {
  id: string | null;
}

interface Client extends BaseEntity {
  firstName: string;
  lastName: string;
  company: string;
}
```

Let's create some clients

```javascript
const peter: Client = {
  id: "1",
  firstName: "Peter",
  lastName: "Porker",
  company: "Acme, Inc",
};

const john: Client = {
  id: "2",
  firstName: "John",
  lastName: "Doe",
  company: "NA",
};

const clients: Client[] = [peter, john];
```

Now, create a client state for client entity:

```javascript
interface ClientsState {
  clients: Client[];
  currentClient: Client;
}

const newClient: Client = {
  id: null,
  firstName: "",
  lastName: "",
  company: "",
};

const initialClientsState: ClientsState = {
  clients,
  currentClient: newClient,
};

const CLIENT_LOAD = "[Client] Load";
const CLIENT_CREATE = "[Client] Create";
const CLIENT_UPDATE = "[Client] Update";
const CLIENT_DELETE = "[Client] Delete";
const CLIENT_SELECT = "[Client] Select";
const CLIENT_CLEAR = "[Client] Clear";
```

Let's prepare some functions for client reducer (#need to learn about reducer here):

```javascript
const loadClients = (state, clients): ClientsState => {
  return {
    clients,
    currentClient: state.currentClient,
  };
};

const selectClient = (state, client): ClientsState => {
  return {
    clients: state.clients,
    currentClient: client,
  };
};

const clearClient = (state): ClientsState => {
  return {
    clients: state.clients,
    currentClient: null,
  };
};

const createClient = (state, client): ClientsState => {
  return {
    clients: [...state.clients, client],
    currentClient: state.currentClient,
    // clients: state.clients.concat(client) // The concat() method is used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array. - MDN,
  };
};

const updateClient = (state, client): ClientsState => {
  return {
    // The map() method creates a new array with the results of calling a provided function on every element in this array.
    // The Object.assign() method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object.
    clients: state.clients.map((c) => {
      return c.id === client.id ? Object.assign({}, client) : c;
    }),
    currentClient: state.currentClient,
  };
};

const deleteClient = (state, client): ClientsState => {
  return {
    // The filter() method creates a new array with all elements that pass the test implemented by the provided function.
    clients: state.clients.filter((c) => c.id !== client.id),
    currentClient: state.currentClient,
  };
};

const clientsReducer = (
  state: ClientsState = initialClientsState,
  action: Action
) => {
  switch (action.type) {
    case CLIENT_LOAD:
      return loadClients(state, action.payload);
    case CLIENT_SELECT:
      return selectClient(state, action.payload);
    case CLIENT_CLEAR:
      return clearClient(state);
    case CLIENT_CREATE:
      return createClient(state, action.payload);
    case CLIENT_UPDATE:
      return updateClient(state, action.payload);
    case CLIENT_DELETE:
      return deleteClient(state, action.payload);
    default:
      return state;
  }
};
```

Create a client store

```javascript
class ClientsStore {
  reducer;
  state: ClientsState;

  constructor(state: ClientsState, reducer) {
    this.state = state;
    this.reducer = reducer;
  }

  getState() {
    return this.state;
  }

  select(key: string) {
    return this.state[key];
  }

  dispatch(action: Action) {
    this.state = this.reducer(this.state, action);
  }
}
```

Use client with example:

```javascript
const jane: Client = {
  id: "123",
  firstName: "Jane",
  lastName: "Doe",
  company: "Anon",
};

const clientsStore = new ClientsStore(initialClientsState, clientsReducer);
const aClient = clientsStore.select("currentClient");
clientsStore.dispatch({ type: CLIENT_CREATE, payload: jane });
const allClients = clientsStore.select("clients");
```

This is the short version of reducer:

```javascript
const addEntity = (collection, entity) => [...collection, entity];
const updateEntity = (collection, entity) =>
  collection.map((e) => (e.id === entity.id ? Object.assign({}, entity) : e));
const deleteEntity = (collection, entity) =>
  collection.filter((e) => e.id !== entity.id);
```

## Communication Methods

Message software for realtime communication to solve new issues or untracked problems

- Standards for messaging
- When a new problem is raised - we create a ticket for it and include Slack threads
- All critical information must be in the issue or ticket NOT in Slack (culture)
- When new information is shared - we need an article or document for that (culture)
  - Developers must prompt each other to write documentation

Centralized documentation platform

- Simplicity, removes checking anywhere else
- Simplicity around organization in the documentation
  - Each team gets their own section or "are" that can be managed on it's own
- Remove the need of managing more things
- Searching & filtering
- Real-time?
- Liking information between email, documents

## Quality Control / Quality Assurance

## Contract

Check sample here [Contract](https://drive.google.com/drive/folders/1AoDcXV0qHSveWrURPq2kxCYj1vmMaRdy?usp=drive_link)

## References

- [User retention](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
