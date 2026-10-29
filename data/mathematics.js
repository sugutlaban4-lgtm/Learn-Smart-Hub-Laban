window.LSH_SUBJECT = {
  id: "mathematics",
  name: "Mathematics",
  back: "mathematics.html",
  notes: [
    {
      topic: "Algebraic expressions",
      level: "Grade 10",
      summary: "This topic covers simplifying algebraic expressions by collecting like terms, expanding brackets, and substituting values.",
      points: [
        "Like terms have identical variable parts and can be added or subtracted together.",
        "Unlike terms cannot be combined into a single term.",
        "When expanding brackets, multiply the term outside by every term inside.",
        "Substitution involves replacing variables with given numerical values to evaluate the expression.",
        "Negative signs outside a bracket change the sign of every term inside when expanded."
      ],
      formula: "a^2 - b^2 = (a - b)(a + b)",
      example: {
        question: "Simplify 3(2x - 4) - 2(x - 5).",
        solution: "Step 1: Expand the first bracket: 3 * 2x - 3 * 4 = 6x - 12. Step 2: Expand the second bracket: -2 * x - 2 * (-5) = -2x + 10. Step 3: Combine like terms: 6x - 2x - 12 + 10 = 4x - 2. Final answer: 4x - 2."
      }
    },
    {
      topic: "Linear equations",
      level: "Grade 10",
      summary: "This topic explains how to solve linear equations with one unknown by isolating the variable using inverse operations.",
      points: [
        "A linear equation is an equation of degree one involving one or more variables.",
        "Perform the same mathematical operation on both sides to keep the equation balanced.",
        "Group all variable terms on one side and constant terms on the other side.",
        "Clear fractions by multiplying every term by the lowest common denominator.",
        "Check your final solution by substituting the value back into the original equation."
      ],
      formula: null,
      example: {
        question: "Solve for x in the equation 5x - 7 = 2x + 8.",
        solution: "Step 1: Subtract 2x from both sides: 3x - 7 = 8. Step 2: Add 7 to both sides: 3x = 15. Step 3: Divide both sides by 3: x = 5. Final answer: x = 5."
      }
    },
    {
      topic: "Simultaneous equations",
      level: "Grade 10",
      summary: "This topic focuses on finding common solutions for two linear equations containing two variables using elimination and substitution methods.",
      points: [
        "Simultaneous equations are two or more equations that are satisfied by the same values of the variables.",
        "The elimination method eliminates one variable by adding or subtracting the equations.",
        "Multiply equations by suitable numbers if coefficients of the variable to be eliminated are not equal.",
        "The substitution method expresses one variable in terms of the other and substitutes it into the second equation.",
        "Always check the values of both variables in both original equations."
      ],
      formula: null,
      example: {
        question: "Solve the simultaneous equations 2x + y = 11 and 3x - y = 9.",
        solution: "Step 1: Add the two equations to eliminate y: (2x + 3x) + (y - y) = 11 + 9, which gives 5x = 20. Step 2: Divide by 5 to find x: x = 4. Step 3: Substitute x = 4 into 2x + y = 11: 2(4) + y = 11, so 8 + y = 11, which gives y = 3. Final answer: x = 4, y = 3."
      }
    },
    {
      topic: "Inequalities",
      level: "Grade 10",
      summary: "This topic covers solving linear inequalities in one variable and representing their solutions on number lines.",
      points: [
        "Inequalities use relation symbols such as less than, greater than, less than or equal to, and greater than or equal to.",
        "Solving an inequality is similar to solving an equation, except when multiplying or dividing by a negative number.",
        "Multiplying or dividing both sides of an inequality by a negative number reverses the inequality sign.",
        "A strict inequality uses an open circle on a number line, while an inclusive inequality uses a solid circle.",
        "Compound inequalities combine two inequalities into a single statement or range."
      ],
      formula: null,
      example: {
        question: "Solve the inequality 4 - 3x <= 13.",
        solution: "Step 1: Subtract 4 from both sides: -3x <= 9. Step 2: Divide both sides by -3 and reverse the inequality sign: x >= -3. Final answer: x >= -3."
      }
    },
    {
      topic: "Quadratic expressions and factorisation",
      level: "Grade 10",
      summary: "This topic teaches how to expand, factorise, and solve quadratic expressions and equations using splitting the middle term and the quadratic formula.",
      points: [
        "A quadratic expression has the general form ax^2 + bx + c where a is not equal to zero.",
        "Factorising a quadratic means writing it as a product of two linear factors.",
        "To factorise ax^2 + bx + c, find two numbers that multiply to give ac and add up to b.",
        "The difference of two squares follows the pattern a^2 - b^2 = (a - b)(a + b).",
        "Quadratic equations ax^2 + bx + c = 0 can be solved using the quadratic formula when factorisation is difficult."
      ],
      formula: "x = (-b +- sqrt(b^2 - 4ac)) / (2a)",
      example: {
        question: "Factorise the quadratic expression x^2 - 5x + 6 and find the roots of x^2 - 5x + 6 = 0.",
        solution: "Step 1: Find two numbers that multiply to 6 and add up to -5, which are -2 and -3. Step 2: Factorise as (x - 2)(x - 3). Step 3: Set each factor to zero: x - 2 = 0 or x - 3 = 0. Final answer: (x - 2)(x - 3), roots are x = 2 and x = 3."
      }
    },
    {
      topic: "Pythagoras and trigonometry of right triangles",
      level: "Grade 10",
      summary: "This topic covers calculating unknown side lengths and angles in right-angled triangles using Pythagoras theorem and trigonometric ratios.",
      points: [
        "Pythagoras theorem states that in a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
        "The hypotenuse is always the longest side and lies opposite the right angle.",
        "The primary trigonometric ratios are sine, cosine, and tangent, remembered by SOH CAH TOA.",
        "Sine of an angle is opposite divided by hypotenuse, cosine is adjacent divided by hypotenuse, and tangent is opposite divided by adjacent.",
        "Inverse trigonometric functions are used to calculate an unknown angle when two side lengths are given."
      ],
      formula: "a^2 + b^2 = c^2, sin(theta) = opp/hyp, cos(theta) = adj/hyp, tan(theta) = opp/adj",
      example: {
        question: "A right-angled triangle has a base of 6 cm and a height of 8 cm. Calculate the length of the hypotenuse.",
        solution: "Step 1: Apply Pythagoras theorem: c^2 = a^2 + b^2 = 6^2 + 8^2. Step 2: Calculate squares: c^2 = 36 + 64 = 100. Step 3: Take the square root: c = sqrt(100) = 10 cm. Final answer: 10 cm."
      }
    },
    {
      topic: "Area and volume of solids",
      level: "Grade 10",
      summary: "This topic covers calculating the surface area and volume of three-dimensional solids such as prisms, cylinders, pyramids, and spheres.",
      points: [
        "Volume measures the space occupied by a 3D object and is measured in cubic units.",
        "Surface area is the total area of all outer faces of a 3D solid.",
        "The volume of any right prism is the base area multiplied by the height.",
        "A cylinder has a volume of pi * r^2 * h and total surface area of 2 * pi * r * h + 2 * pi * r^2.",
        "Converting between units requires cubing the linear scale factor for volumes."
      ],
      formula: "Volume of cylinder = pi * r^2 * h, Surface Area of cylinder = 2*pi*r*h + 2*pi*r^2",
      example: {
        question: "Calculate the volume of a closed cylinder with radius 7 cm and height 10 cm. Take pi = 22/7.",
        solution: "Step 1: Use the volume formula V = pi * r^2 * h. Step 2: Substitute values: V = (22/7) * 7^2 * 10 = (22/7) * 49 * 10. Step 3: Simplify: V = 22 * 7 * 10 = 1540 cm^3. Final answer: 1540 cm^3."
      }
    },
    {
      topic: "Indices and surds",
      level: "Grade 10",
      summary: "This topic explains the laws of indices and operations on surds including simplification and rationalising denominators.",
      points: [
        "The multiplication law states a^m * a^n = a^(m+n), and division law states a^m / a^n = a^(m-n).",
        "Any non-zero number raised to the power of zero equals 1, so a^0 = 1.",
        "A negative exponent represents a reciprocal: a^(-n) = 1 / (a^n).",
        "A fractional index represents a root: a^(1/n) = n-th root of a.",
        "Surds are irrational roots of numbers, simplified by factoring out square numbers."
      ],
      formula: "a^m * a^n = a^(m+n), a^m / a^n = a^(m-n), (a^m)^n = a^(m*n), a^0 = 1",
      example: {
        question: "Simplify (2^5 * 2^3) / 2^4.",
        solution: "Step 1: Apply the multiplication law in the numerator: 2^(5+3) = 2^8. Step 2: Apply the division law: 2^8 / 2^4 = 2^(8-4) = 2^4. Step 3: Evaluate 2^4 = 16. Final answer: 16."
      }
    },
    {
      topic: "Statistics and grouped data",
      level: "Grade 10",
      summary: "This topic covers calculating measures of central tendency including mean, median, and mode for both discrete data sets and continuous grouped data distributions.",
      points: [
        "The mean of a data set is calculated by dividing the sum of all values by the total number of observations.",
        "The median represents the middle value when data is arranged in ascending order of magnitude.",
        "The mode is the data value or class interval that appears with the highest frequency.",
        "For grouped data, the estimated mean is calculated using class midpoints multiplied by their respective frequency values.",
        "Cumulative frequency curves or ogives are used to estimate medians and quartiles for grouped distributions."
      ],
      formula: "Mean = sum(f * x) / sum(f)",
      example: {
        question: "A Kenyan farmer recorded the daily milk yield in litres from 5 cows: 12, 15, 14, 15, and 19. Calculate the mean and mode of the milk yields.",
        solution: "Step 1: Calculate the sum of all milk yields: 12 + 15 + 14 + 15 + 19 = 75. Step 2: Divide the total by the number of cows to find the mean: 75 / 5 = 15 litres. Step 3: Identify the yield with the highest frequency: 15 litres appears twice, so the mode is 15 litres. Final answer: Mean = 15 litres, Mode = 15 litres."
      }
    },
    {
      topic: "Commercial arithmetic",
      level: "Grade 10",
      summary: "This topic explains financial calculations involving simple interest, compound interest, profit and loss percentages, discounts, commission, and hire purchase transactions.",
      points: [
        "Profit or loss is calculated by taking the difference between selling price and buying price.",
        "Percentage profit or loss is expressed as a ratio over the original cost price multiplied by 100.",
        "Simple interest is earned strictly on the initial principal amount over a specified period.",
        "Compound interest accumulates on both the principal amount and interest earned in previous compounding periods.",
        "Hire purchase allows buyers to pay a deposit followed by equal monthly instalments over an agreed timeframe."
      ],
      formula: "A = P * (1 + r/100)^n, I = (P * R * T) / 100",
      example: {
        question: "A trader in Nairobi buys a sack of maize for 3000 Kenyan shillings and sells it for 3600 Kenyan shillings. Calculate the percentage profit.",
        solution: "Step 1: Calculate the profit made by subtracting the cost price from the selling price: 3600 - 3000 = 600 shillings. Step 2: Divide the profit by the cost price: 600 / 3000 = 0.2. Step 3: Multiply by 100 to convert to percentage: 0.2 * 100 = 20 percent. Final answer: 20 percent."
      }
    },
    {
      topic: "Probability",
      level: "Grade 10",
      summary: "This topic focuses on determining the likelihood of events occurring using theoretical probability formulas, outcome spaces, tree diagrams, and combined probability rules.",
      points: [
        "Probability is a measure of likelihood expressed as a number between 0 and 1 inclusive.",
        "An event with a probability of 0 is impossible, while an event with a probability of 1 is certain.",
        "The sum of probabilities for all mutually exclusive and exhaustive outcomes equals 1.",
        "For independent events, the probability of both events occurring is found by multiplying their individual probabilities.",
        "Tree diagrams help visualize outcomes and calculate probabilities for sequential multi-stage experiments."
      ],
      formula: "P(A) = n(A) / n(S), P(A or B) = P(A) + P(B)",
      example: {
        question: "A bag contains 5 red balls and 3 blue balls. A ball is drawn at random. What is the probability of drawing a red ball?",
        solution: "Step 1: Find the total number of balls in the bag: 5 + 3 = 8. Step 2: Identify the number of favourable outcomes for red balls, which is 5. Step 3: Divide favourable outcomes by total outcomes: P(red) = 5 / 8. Final answer: 5/8."
      }
    },
    {
      topic: "Matrices",
      level: "Grade 11",
      summary: "This topic covers matrix operations including addition, scalar multiplication, matrix multiplication, determinant calculation, and finding inverses for solving simultaneous equations.",
      points: [
        "A matrix is a rectangular array of numbers arranged in rows and columns.",
        "Matrices can only be added or subtracted if they have identical dimensions.",
        "Matrix multiplication requires the number of columns in the first matrix to match the rows in the second matrix.",
        "The determinant of a 2x2 matrix with elements [a, b; c, d] is calculated as a*d - b*c.",
        "A matrix is non-singular and has an inverse if its determinant is not equal to zero."
      ],
      formula: "det(A) = a*d - b*c, A^(-1) = (1 / (a*d - b*c)) * [d, -b; -c, a]",
      example: {
        question: "Find the determinant of the 2x2 matrix A = [4, 2; 3, 5].",
        solution: "Step 1: Identify matrix entries: a = 4, b = 2, c = 3, and d = 5. Step 2: Multiply the main diagonal entries: 4 * 5 = 20. Step 3: Multiply the off-diagonal entries and subtract from main product: 20 - (2 * 3) = 20 - 6 = 14. Final answer: 14."
      }
    },
    {
      topic: "Circle geometry",
      level: "Grade 11",
      summary: "This topic covers geometric properties of circles including angle theorems, chord properties, cyclic quadrilaterals, tangents, and alternate segment angle theorems.",
      points: [
        "The angle subtended by an arc at the centre is twice the angle subtended at the circumference.",
        "Angles subtended by the same arc in the same segment of a circle are equal.",
        "The angle subtended at the circumference by a diameter is always a right angle of 90 degrees.",
        "Opposite angles of a cyclic quadrilateral add up to 180 degrees.",
        "A tangent to a circle is perpendicular to the radius drawn to the point of contact."
      ],
      formula: "Angle at centre = 2 * Angle at circumference",
      example: {
        question: "In a circle with centre O, an arc AB subtends an angle of 70 degrees at the circumference. Calculate the angle subtended by arc AB at the centre O.",
        solution: "Step 1: Recall the angle theorem stating that the central angle is twice the angle at the circumference. Step 2: Multiply the circumference angle by 2: 2 * 70 degrees = 140 degrees. Step 3: State the resulting angle value. Final answer: 140 degrees."
      }
    },
    {
      topic: "Coordinate geometry and straight lines",
      level: "Grade 10",
      summary: "This topic covers finding midpoints, line segment lengths, gradients, parallel and perpendicular slopes, and equations of straight lines in coordinate planes.",
      points: [
        "The gradient of a line passing through points (x1, y1) and (x2, y2) is (y2 - y1) / (x2 - x1).",
        "Parallel lines have equal gradients while perpendicular lines have gradients whose product is -1.",
        "The equation of a straight line is commonly written in gradient-intercept form as y = m*x + c.",
        "The distance between two points (x1, y1) and (x2, y2) is sqrt((x2 - x1)^2 + (y2 - y1)^2).",
        "The midpoint of a line segment joining two points is ((x1 + x2)/2, (y1 + y2)/2)."
      ],
      formula: "m = (y2 - y1) / (x2 - x1), y - y1 = m * (x - x1)",
      example: {
        question: "Find the gradient of the straight line passing through points A(2, 3) and B(6, 11).",
        solution: "Step 1: Identify coordinates x1 = 2, y1 = 3, x2 = 6, and y2 = 11. Step 2: Apply the gradient formula m = (y2 - y1) / (x2 - x1). Step 3: Substitute and simplify: m = (11 - 3) / (6 - 2) = 8 / 4 = 2. Final answer: 2."
      }
    },
    {
      topic: "Sequences and series",
      level: "Grade 11",
      summary: "This topic explores arithmetic and geometric progressions, determining general terms, common differences or ratios, and calculating sum of terms for finite series.",
      points: [
        "An arithmetic progression has a constant common difference added between consecutive terms.",
        "The n-th term of an arithmetic progression is given by T_n = a + (n - 1)*d.",
        "A geometric progression has a constant common ratio multiplied between consecutive terms.",
        "The n-th term of a geometric progression is given by T_n = a * r^(n - 1).",
        "The sum of the first n terms of an arithmetic progression is S_n = (n / 2) * (2*a + (n - 1)*d)."
      ],
      formula: "T_n = a + (n - 1)*d, S_n = (n / 2) * (2*a + (n - 1)*d), T_n = a * r^(n - 1)",
      example: {
        question: "Find the 10th term of an arithmetic progression with first term a = 4 and common difference d = 3.",
        solution: "Step 1: Identify given values: a = 4, d = 3, and n = 10. Step 2: Use the n-th term formula T_n = a + (n - 1)*d. Step 3: Substitute values: T_10 = 4 + (10 - 1) * 3 = 4 + 9 * 3 = 4 + 27 = 31. Final answer: 31."
      }
    },
    {
      topic: "Bearings and scale drawing",
      level: "Grade 10",
      summary: "This topic explains representing directions as three-figure bearings measured clockwise from true north and using scale drawings to determine distances and positions.",
      points: [
        "Bearings are angles measured clockwise from true north and expressed using three digits.",
        "A direction pointing directly East corresponds to a three-figure bearing of 090 degrees.",
        "Back bearing is the opposite direction found by adding or subtracting 180 degrees from the forward bearing.",
        "Scale drawing uses a fixed ratio to represent actual physical distances accurately on paper.",
        "Trigonometry and sine or cosine rules can be used to calculate actual distances from bearing diagrams."
      ],
      formula: "Back bearing = Forward bearing +- 180 deg",
      example: {
        question: "A town B is on a bearing of 065 degrees from town A. Calculate the back bearing of town A from town B.",
        solution: "Step 1: Check if the forward bearing is less than 180 degrees: 65 degrees is less than 180 degrees. Step 2: Add 180 degrees to find the back bearing: 65 + 180 = 245 degrees. Step 3: Express the result as a three-figure bearing: 245 degrees. Final answer: 245 deg."
      }
    },
    {
      topic: "Linear programming",
      level: "Grade 11",
      summary: "This topic details formulating linear inequalities from practical contextual constraints, graphing feasible regions, and optimizing objective functions to find maximum or minimum values.",
      points: [
        "Linear programming optimizes a linear function subject to linear inequality constraints.",
        "Decision variables represent quantities being determined, such as numbers of products to produce.",
        "Inequality constraints are plotted as straight boundary lines on Cartesian axes.",
        "The feasible region is the shaded area containing all coordinate points satisfying all constraints simultaneously.",
        "Optimal values occur at corner vertices of the feasible region polygon."
      ],
      formula: "Objective function Z = a*x + b*y",
      example: {
        question: "A matatu driver transports x adults and y children. The total capacity is at most 14 passengers. Express this constraint as an inequality.",
        solution: "Step 1: Identify the variables representing passengers: x for adults and y for children. Step 2: Combine the variables to represent total passengers: x + y. Step 3: Apply the maximum limit condition of 14: x + y <= 14. Final answer: x + y <= 14."
      }
    },
    {
      topic: "Distance, speed, and time",
      level: "Grade 10",
      summary: "This topic covers calculating average speed, travel distance, motion time, relative speeds of approaching or overtaking objects, and interpreting travel graphs.",
      points: [
        "Speed is defined as the rate of change of distance with respect to time.",
        "Average speed is calculated by dividing total distance travelled by total time taken.",
        "When two vehicles travel towards each other, their relative speed is the sum of their individual speeds.",
        "When one vehicle chases another in the same direction, their relative speed is the difference between their speeds.",
        "The gradient of a distance-time graph represents the speed of the moving object."
      ],
      formula: "Speed = Distance / Time, Distance = Speed * Time, Time = Distance / Speed",
      example: {
        question: "A matatu travels a distance of 180 kilometres from Nairobi to Nakuru in 3 hours. Calculate its average speed in kilometres per hour.",
        solution: "Step 1: Identify the given distance d = 180 km and time t = 3 hours. Step 2: Apply the speed formula: Speed = Distance / Time. Step 3: Divide distance by time: 180 / 3 = 60 km/h. Final answer: 60 km/h."
      }
    }
  ],
  papers: [
    {
      title: "Mathematics Paper 1",
      meta: "Grade 10 · 1 hour 30 minutes · 40 marks",
      instructions: "Answer all the questions. Show your working.",
      sections: [
        {
          heading: "Section A: short answers",
          questions: [
            {
              q: "Simplify 4a + 3b - 2a + 5b.",
              marks: 2,
              answer: "2a + 8b"
            },
            {
              q: "Solve 3x + 5 = 20.",
              marks: 2,
              answer: "3x = 15, x = 5"
            },
            {
              q: "Evaluate 3^4 * 3^(-2).",
              marks: 2,
              answer: "3^(4 - 2) = 3^2 = 9"
            },
            {
              q: "Factorise x^2 - 9.",
              marks: 2,
              answer: "(x - 3)(x + 3)"
            },
            {
              q: "Solve 2(x - 3) = 8.",
              marks: 2,
              answer: "2x - 6 = 8, 2x = 14, x = 7"
            },
            {
              q: "Solve the inequality 2x - 1 < 7.",
              marks: 2,
              answer: "2x < 8, x < 4"
            },
            {
              q: "Find the mean of 4, 7, 9, 10, 15.",
              marks: 2,
              answer: "Sum = 45, Mean = 45 / 5 = 9"
            },
            {
              q: "Calculate the hypotenuse of a right triangle with legs of length 3 cm and 4 cm.",
              marks: 2,
              answer: "sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5 cm"
            },
            {
              q: "Calculate the area of a circle with radius 7 cm. Take pi = 22/7.",
              marks: 2,
              answer: "Area = (22/7) * 7^2 = 22 * 7 = 154 cm^2"
            },
            {
              q: "Solve x^2 - 4x = 0.",
              marks: 2,
              answer: "x(x - 4) = 0, so x = 0 or x = 4"
            }
          ]
        },
        {
          heading: "Section B: structured questions",
          questions: [
            {
              q: "Solve the simultaneous equations 3x + 2y = 16 and x - 2y = 0.",
              marks: 4,
              answer: "Step 1: Add the two equations: 4x = 16, so x = 4. Step 2: Substitute x = 4 into x - 2y = 0: 4 - 2y = 0, so 2y = 4, y = 2. Final answer: x = 4, y = 2."
            },
            {
              q: "A rectangular water tank has a length of 2 m, width of 1.5 m, and height of 1 m. Calculate its volume in cubic metres and in litres.",
              marks: 4,
              answer: "Step 1: Volume in m^3 = length * width * height = 2 * 1.5 * 1 = 3 m^3. Step 2: Convert to litres using 1 m^3 = 1000 litres: 3 * 1000 = 3000 litres. Final answer: Volume = 3 m^3 (3000 litres)."
            },
            {
              q: "Solve the quadratic equation x^2 - 7x + 12 = 0 by factorisation.",
              marks: 4,
              answer: "Step 1: Find two numbers that multiply to 12 and add to -7, which are -3 and -4. Step 2: Write in factorised form: (x - 3)(x - 4) = 0. Step 3: Set each factor to zero: x - 3 = 0 or x - 4 = 0. Final answer: x = 3 or x = 4."
            },
            {
              q: "A ladder 13 m long leans against a vertical wall. If the foot of the ladder is 5 m away from the base of the wall, calculate how high up the wall the ladder reaches.",
              marks: 4,
              answer: "Step 1: Let height be h. By Pythagoras theorem, h^2 + 5^2 = 13^2. Step 2: h^2 + 25 = 169, so h^2 = 169 - 25 = 144. Step 3: h = sqrt(144) = 12 m. Final answer: 12 m."
            },
            {
              q: "The marks obtained by 6 students in a maths test are 12, 15, 18, 14, 20, and 17. Calculate the mean mark and median mark.",
              marks: 4,
              answer: "Step 1: Sum of marks = 12 + 15 + 18 + 14 + 20 + 17 = 96. Mean = 96 / 6 = 16. Step 2: Arrange marks in ascending order: 12, 14, 15, 17, 18, 20. The two middle values are 15 and 17. Median = (15 + 17) / 2 = 16. Final answer: Mean = 16, Median = 16."
            }
          ]
        }
      ]
    }
  ],
  quizzes: {
    mathematics: {
      title: "Mathematics Quiz",
      subtitle: "Test your Grade 10 Mathematics knowledge.",
      questions: [
        {
          q: "What is the simplified form of 5a + 3b - 2a + 4b?",
          options: ["7a + 7b", "3a + 7b", "3a + b"],
          answer: 1,
          why: "Combine like terms to get 5a - 2a = 3a and 3b + 4b = 7b."
        },
        {
          q: "Solve for x in the equation 4x - 9 = 15.",
          options: ["x = 6", "x = 4", "x = 8"],
          answer: 0,
          why: "Adding 9 to both sides gives 4x = 24, then dividing by 4 gives x = 6."
        },
        {
          q: "What is the value of 5^0 + 2^3?",
          options: ["8", "9", "4"],
          answer: 1,
          why: "Any non-zero number to the power 0 is 1, so 1 + 8 = 9."
        },
        {
          q: "If x + y = 10 and x - y = 4, what is the value of x?",
          options: ["x = 7", "x = 6", "x = 8"],
          answer: 0,
          why: "Adding the two equations eliminates y to give 2x = 14, so x = 7."
        },
        {
          q: "Which inequality represents the statement: three times a number x is less than 12?",
          options: ["3x > 12", "3x <= 12", "3x < 12"],
          answer: 2,
          why: "The phrase less than corresponds to the symbol < without equality."
        },
        {
          q: "What are the factors of x^2 - 16?",
          options: ["(x - 4)(x - 4)", "(x - 4)(x + 4)", "(x - 8)(x + 2)"],
          answer: 1,
          why: "This is a difference of two squares where a^2 - b^2 = (a - b)(a + b)."
        },
        {
          q: "A right triangle has perpendicular sides of length 5 cm and 12 cm. What is the hypotenuse?",
          options: ["13 cm", "17 cm", "15 cm"],
          answer: 0,
          why: "The hypotenuse is sqrt(5^2 + 12^2) = sqrt(25 + 144) = sqrt(169) = 13 cm."
        },
        {
          q: "In a right triangle, what ratio is equal to opposite divided by hypotenuse?",
          options: ["Cosine", "Sine", "Tangent"],
          answer: 1,
          why: "By definition, sine of an angle is the length of the opposite side divided by the hypotenuse."
        },
        {
          q: "What is the area of a circle with a radius of 7 cm using pi = 22/7?",
          options: ["44 cm^2", "154 cm^2", "308 cm^2"],
          answer: 1,
          why: "Area equals pi * r^2, which is (22/7) * 7 * 7 = 154 cm^2."
        },
        {
          q: "Calculate the volume of a cube with edge length 4 cm.",
          options: ["16 cm^3", "48 cm^3", "64 cm^3"],
          answer: 2,
          why: "Volume of a cube equals side length cubed, so 4 * 4 * 4 = 64 cm^3."
        },
        {
          q: "What is the simplified form of sqrt(50)?",
          options: ["5 * sqrt(2)", "2 * sqrt(5)", "10 * sqrt(5)"],
          answer: 0,
          why: "sqrt(50) equals sqrt(25 * 2), which simplifies to 5 * sqrt(2)."
        },
        {
          q: "What is the mean of the numbers 6, 8, 10, 12, and 14?",
          options: ["9", "10", "11"],
          answer: 1,
          why: "The sum of the five numbers is 50, and 50 divided by 5 equals 10."
        },
        {
          q: "Find the median of the dataset: 3, 9, 5, 11, 7.",
          options: ["5", "7", "9"],
          answer: 1,
          why: "Arranging the data in ascending order 3, 5, 7, 9, 11 gives the middle number 7."
        },
        {
          q: "What are the solutions to the equation x^2 - 9x + 20 = 0?",
          options: ["x = 4 or x = 5", "x = -4 or x = -5", "x = 2 or x = 10"],
          answer: 0,
          why: "Factorising gives (x - 4)(x - 5) = 0, so the roots are x = 4 and x = 5."
        },
        {
          q: "Solve for y in the equation y/3 + 4 = 7.",
          options: ["y = 6", "y = 9", "y = 11"],
          answer: 1,
          why: "Subtract 4 from both sides to get y/3 = 3, then multiply by 3 to get y = 9."
        }
      ]
    }
  }
};
