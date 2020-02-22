import {assertEquals} from "https://deno.land/std@v0.33.0/testing/asserts.ts"

Deno.test(function t1() {
  assertEquals("Hello", "Hello");  
});

// tsserver cries if sees a wild await.
(async () =>  await Deno.runTests())();
