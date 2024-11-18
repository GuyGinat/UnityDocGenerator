using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using UnityEditor;
using UnityEngine;

namespace Editor
{
    public class ReflectionDocumentationGenerator : MonoBehaviour
    {
        [MenuItem("Tools/Generate Reflection Documentation")]
        public static void GenerateDocumentation()
        {
            List<string> documentation = new List<string>();

            // Load the runtime assembly where most user scripts are located
            Assembly assembly = Assembly.Load("Assembly-CSharp");

            foreach (var type in assembly.GetTypes())
            {
                if (type.IsClass && type.IsPublic) // Filter for public classes only
                {
                    // Only add if class has methods
                    List<string> methodsInfo = new List<string>();
                    foreach (var method in type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly))
                    {
                        string parameters = string.Join(", ", Array.ConvertAll(method.GetParameters(), p => $"\"{p.ParameterType.Name} {p.Name}\""));
                        string methodInfo = $"{{ \"methodName\": \"{method.Name}\", \"returnType\": \"{method.ReturnType.Name}\", \"parameters\": [{parameters}] }}";
                        methodsInfo.Add(methodInfo);
                    }

                    if (methodsInfo.Count > 0)
                    {
                        string classInfo = $"{{ \"namespace\": \"{type.Namespace ?? "Global"}\", \"className\": \"{type.Name}\", \"methods\": [{string.Join(", ", methodsInfo)}] }}";
                        documentation.Add(classInfo);
                    }
                }
            }

            // Manually build the JSON string
            string jsonOutput = "{ \"classes\": [" + string.Join(", ", documentation) + "] }";

            // Save the JSON string to a file
            Directory.CreateDirectory(Application.dataPath + "/Documentation");
            File.WriteAllText(Application.dataPath + "/Documentation/methods.json", jsonOutput);

            Debug.Log("Reflection-based documentation generated successfully. Check Assets/Documentation/methods.json");
        }
    }
}
