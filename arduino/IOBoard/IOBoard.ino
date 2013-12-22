#include<Wire.h>





const int ledPin =  13;      // the number of the LED pin

int ledState = LOW;             // ledState used to set the LED
long previousMillis = 0;        // will store last time LED was updated
long interval = 1000;           // interval at which to blink (milliseconds)

void setup() {
  pinMode(ledPin, OUTPUT);      
  Serial.begin(9600);
}

void loop()
{
  unsigned long currentMillis = millis();
  if(currentMillis - previousMillis > interval) 
  {
    previousMillis = currentMillis;   
    ledState = !ledState;
    digitalWrite(ledPin, ledState);
    Serial.println(ledState);
  }
}

