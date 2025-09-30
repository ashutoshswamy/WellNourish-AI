'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const guidanceData = [
  {
    title: "Understanding Macronutrients",
    content: "Macronutrients are the nutrients your body needs in large amounts: carbohydrates, proteins, and fats. A balanced diet includes a healthy proportion of all three. Carbohydrates are your main source of energy, protein is essential for muscle repair and growth, and fats are important for hormone production and nutrient absorption."
  },
  {
    title: "The Importance of Hydration",
    content: "Water is crucial for nearly every bodily function, including regulating temperature, transporting nutrients, and lubricating joints. Aim to drink at least 8 glasses (about 2 liters) of water per day, and more if you are active or in a hot climate."
  },
  {
    title: "Proper Warm-up and Cool-down",
    content: "A good warm-up (5-10 minutes of light cardio and dynamic stretching) increases blood flow to muscles and reduces injury risk. A cool-down (5-10 minutes of static stretching) helps your body gradually return to a resting state and can improve flexibility."
  },
  {
    title: "Consistency is Key",
    content: "Achieving your fitness goals is a marathon, not a sprint. Consistency in both your diet and workout routine is more important than perfection. Don't be discouraged by occasional slip-ups; just get back on track with your next meal or workout."
  }
];

export function Guidance() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Wellness Guidance</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {guidanceData.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
