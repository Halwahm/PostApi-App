import { defineAbility } from "@casl/ability";
import { IUser, UserRole, Action, Resource } from "../globals";

export function defineAbilitiesFor({ id, role }: IUser) {
  return defineAbility((can) => {
    if (role === UserRole.Admin) {
      can(Action.Manage, Resource.All);

      can(Action.Read, [Resource.User, Resource.Post, Resource.Like]);

      can(Action.Create, [Resource.Post, Resource.Like]);
      can(Action.Delete, Resource.Like);
      can([Action.Update, Action.Delete], Resource.Post, { createdById: id });

      can(Action.Create, Resource.Comment);
      can([Action.Update, Action.Delete], Resource.Comment, { commenterId: id });
      can(Action.Delete, Resource.Comment, { post: { createdById: id } });
    } else if (role === UserRole.Basic) {
      can(Action.Read, [Resource.User, Resource.Post, Resource.Like]);

      can(Action.Create, [Resource.Post, Resource.Like]);
      can(Action.Delete, Resource.Like);
      can([Action.Update, Action.Delete], Resource.Post, { createdById: id });

      can(Action.Create, Resource.Comment);
      can([Action.Update, Action.Delete], Resource.Comment, { commenterId: id });
      can(Action.Delete, Resource.Comment, { post: { createdById: id } });
    }
  });
}

// import { AbilityBuilder, AbilityClass, PureAbility } from "@casl/ability";
// import { Role } from "@prisma/client";
// import { IUser } from "../globals";

// export enum Action {
//   Read = "read",
//   Create = "create",
//   Update = "update",
//   Delete = "delete",
//   Manage = "manage"
// }

// export enum Resource {
//   User = "User",
//   Post = "Post",
//   Comment = "Comment",
//   All = "all"
// }

// export type Subjects = Resource.Post | Resource.Comment | Resource.User | Resource.All;
// export type AppAbility = PureAbility<[Action, Subjects]>;

// export function defineAbilitiesFor(user: IUser): AppAbility {
//   const { can, build } = new AbilityBuilder<AppAbility>(PureAbility as AbilityClass<AppAbility>);

//   if (user.role === Role.Admin) can(Action.Manage, Resource.All);
//   else {
//     can(Action.Read, Resource.User);

//     can([Action.Read, Action.Create], Resource.Post);
//     can([Action.Update, Action.Delete], Resource.Post, { createdById: user.id });

//     can(Action.Create, Resource.Comment);
//     can([Action.Update, Action.Delete], Resource.Comment, { commenterId: user.id });
//     can(Action.Delete, Resource.Comment, { post: { createdById: user.id } });
//   }
//   return build();
// }
